from datetime import datetime, timedelta
import logging
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from core.config import (
    LOGIN_CODE_EXPIRE_MINUTES,
    LOGIN_CODE_LOCK_MINUTES,
    LOGIN_CODE_MAX_ATTEMPTS,
)
from core.email import send_login_code_email
from core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from dependencies.auth import get_current_user
from dependencies.database import get_session
from models.login_challenge import LoginChallenge
from models.user import User
from schemas.auth import (
    LoginChallengeResponse,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
    VerifyLoginCodeRequest,
)


logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/auth",
    tags=["Authentification"],
)


def get_now() -> datetime:
    return datetime.utcnow()


def get_error(
    status_code: int,
    message: str,
) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail={
            "erreur": {
                "code": status_code,
                "message": message,
            }
        },
    )


def generate_login_code() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    data: RegisterRequest,
    session: AsyncSession = Depends(get_session),
) -> User:
    email = data.email.lower()

    query = select(User).where(User.email == email)
    result = await session.exec(query)
    existing_user = result.first()

    if existing_user is not None:
        raise get_error(
            status.HTTP_409_CONFLICT,
            "Cette adresse email existe déjà.",
        )

    user = User(
        email=email,
        password_hash=hash_password(data.password),
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user


@router.post(
    "/login",
    response_model=LoginChallengeResponse,
)
async def login(
    data: LoginRequest,
    session: AsyncSession = Depends(get_session),
) -> LoginChallengeResponse:
    email = data.email.lower()
    recipient_email = email

    query = select(User).where(User.email == email)
    result = await session.exec(query)
    user = result.first()

    if user is None or not verify_password(
        data.password,
        user.password_hash,
    ):
        raise get_error(
            status.HTTP_401_UNAUTHORIZED,
            "Email ou mot de passe incorrect.",
        )

    if user.id is None:
        raise get_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Identifiant utilisateur invalide.",
        )

    user_id = user.id
    now = get_now()

    latest_challenge_query = (
        select(LoginChallenge)
        .where(LoginChallenge.user_id == user_id)
        .order_by(LoginChallenge.id.desc())
    )
    latest_challenge_result = await session.exec(
        latest_challenge_query,
    )
    latest_challenge = latest_challenge_result.first()

    if (
        latest_challenge is not None
        and latest_challenge.locked_until is not None
        and latest_challenge.locked_until > now
    ):
        raise get_error(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "Trop de codes incorrects. Réessayez dans 5 minutes.",
        )

    code = generate_login_code()
    expires_at = now + timedelta(
        minutes=LOGIN_CODE_EXPIRE_MINUTES,
    )

    challenge = LoginChallenge(
        user_id=user_id,
        code_hash=hash_password(code),
        expires_at=expires_at,
    )

    session.add(challenge)
    await session.commit()
    await session.refresh(challenge)

    try:
        send_login_code_email(recipient_email, code)
    except Exception:
        logger.exception(
            "Erreur lors de l'envoi du code de connexion",
        )

        await session.delete(challenge)
        await session.commit()

        raise get_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Impossible d'envoyer le code de connexion.",
        ) from None

    if challenge.id is None:
        raise get_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Identifiant de vérification invalide.",
        )

    return LoginChallengeResponse(
        challenge_id=challenge.id,
        message="Un code de connexion a été envoyé par e-mail.",
    )


@router.post(
    "/verify-code",
    response_model=TokenResponse,
)
async def verify_code(
    data: VerifyLoginCodeRequest,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    challenge = await session.get(
        LoginChallenge,
        data.challenge_id,
    )

    if challenge is None:
        raise get_error(
            status.HTTP_404_NOT_FOUND,
            "Demande de vérification introuvable.",
        )

    now = get_now()

    if challenge.used_at is not None:
        raise get_error(
            status.HTTP_400_BAD_REQUEST,
            "Ce code a déjà été utilisé.",
        )

    if (
        challenge.locked_until is not None
        and challenge.locked_until > now
    ):
        raise get_error(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "Trop de codes incorrects. Réessayez dans 5 minutes.",
        )

    if challenge.expires_at <= now:
        raise get_error(
            status.HTTP_400_BAD_REQUEST,
            "Ce code a expiré. Connectez-vous à nouveau.",
        )

    if not verify_password(data.code, challenge.code_hash):
        challenge.failed_attempts += 1

        if challenge.failed_attempts >= LOGIN_CODE_MAX_ATTEMPTS:
            challenge.locked_until = now + timedelta(
                minutes=LOGIN_CODE_LOCK_MINUTES,
            )

        session.add(challenge)
        await session.commit()

        if challenge.locked_until is not None:
            raise get_error(
                status.HTTP_429_TOO_MANY_REQUESTS,
                "Trop de codes incorrects. Réessayez dans 5 minutes.",
            )

        remaining_attempts = (
            LOGIN_CODE_MAX_ATTEMPTS - challenge.failed_attempts
        )

        raise get_error(
            status.HTTP_401_UNAUTHORIZED,
            f"Code incorrect. Il reste {remaining_attempts} essai(s).",
        )

    user = await session.get(User, challenge.user_id)

    if user is None or user.id is None:
        raise get_error(
            status.HTTP_401_UNAUTHORIZED,
            "Utilisateur introuvable.",
        )

    user_id = user.id

    challenge.used_at = now
    session.add(challenge)
    await session.commit()

    token = create_access_token(user_id)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> User:
    return current_user