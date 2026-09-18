from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from core.security import create_access_token, hash_password, verify_password
from dependencies.auth import get_current_user
from dependencies.database import get_session
from models.user import User
from schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentification"],
)


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
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "erreur": {
                    "code": 409,
                    "message": "Cette adresse email existe déjà",
                }
            },
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
    response_model=TokenResponse,
)
async def login(
    data: LoginRequest,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    email = data.email.lower()

    query = select(User).where(User.email == email)
    result = await session.exec(query)
    user = result.first()

    if user is None or not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "erreur": {
                    "code": 401,
                    "message": "Email ou mot de passe incorrect",
                }
            },
        )

    if user.id is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "erreur": {
                    "code": 500,
                    "message": "Identifiant utilisateur invalide",
                }
            },
        )

    token = create_access_token(user.id)

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