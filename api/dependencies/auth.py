from typing import Annotated

from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer
from jose import JWTError
from jose import jwt
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from core.config import JWT_ALGORITHM
from core.config import JWT_SECRET
from db.database import get_session
from models.user import User


bearer_scheme = HTTPBearer(
    auto_error=False,
)


async def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_scheme),
    ],
    session: Annotated[
        AsyncSession,
        Depends(get_session),
    ],
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=401,
            detail="Vous devez être connecté pour effectuer cette action.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Votre session est invalide.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        numeric_user_id = int(user_id)

    except (JWTError, ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Votre session est invalide ou a expiré.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None

    user = await session.get(User, numeric_user_id)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Utilisateur non trouvé.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user