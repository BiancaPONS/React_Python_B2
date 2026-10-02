import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./collection.db",
)

JWT_SECRET = os.getenv("JWT_SECRET", "")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)

LOGIN_CODE_EXPIRE_MINUTES = int(
    os.getenv("LOGIN_CODE_EXPIRE_MINUTES", "10")
)
LOGIN_CODE_LOCK_MINUTES = int(
    os.getenv("LOGIN_CODE_LOCK_MINUTES", "5")
)
LOGIN_CODE_MAX_ATTEMPTS = int(
    os.getenv("LOGIN_CODE_MAX_ATTEMPTS", "3")
)

if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET est obligatoire")