from datetime import datetime

from sqlmodel import Field, SQLModel


class LoginChallenge(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    user_id: int = Field(
        foreign_key="user.id",
        index=True,
    )

    code_hash: str

    expires_at: datetime = Field(index=True)

    failed_attempts: int = Field(default=0)

    locked_until: datetime | None = Field(
        default=None,
        index=True,
    )

    used_at: datetime | None = Field(
        default=None,
        index=True,
    )