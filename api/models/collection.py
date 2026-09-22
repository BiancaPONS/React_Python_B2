from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class CollectionEntry(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    item_id: int = Field(foreign_key="item.id", index=True)
    statut: str = Field(default="a_decouvrir")
    note: int | None = Field(default=None, ge=0, le=5)
    commentaire: str | None = None
    date_ajout: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )