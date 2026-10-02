import os

from dotenv import load_dotenv


load_dotenv()


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/collection_db",
)

JWT_SECRET = os.getenv("JWT_SECRET", "")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)

LOGIN_CODE_EXPIRE_MINUTES = int(
    os.getenv("LOGIN_CODE_EXPIRE_MINUTES", "5")
)

LOGIN_CODE_MAX_ATTEMPTS = int(
    os.getenv("LOGIN_CODE_MAX_ATTEMPTS", "3")
)

LOGIN_CODE_LOCK_MINUTES = int(
    os.getenv("LOGIN_CODE_LOCK_MINUTES", "5")
)

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
MAIL_FROM = os.getenv("MAIL_FROM", "")


if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET est obligatoire")


if not all(
    [
        SMTP_HOST,
        SMTP_USERNAME,
        SMTP_PASSWORD,
        MAIL_FROM,
    ]
):
    raise RuntimeError(
        "La configuration SMTP est obligatoire."
    )