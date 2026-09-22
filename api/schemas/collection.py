from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

from schemas.item import ItemResponse


Statut = Literal["a_decouvrir", "en_cours", "termine"]


class CollectionCreateRequest(BaseModel):
    item_id: int
    statut: Statut = "a_decouvrir"
    note: int | None = Field(default=None, ge=0, le=5)
    commentaire: str | None = None


class CollectionUpdateRequest(BaseModel):
    statut: Statut | None = None
    note: int | None = Field(default=None, ge=0, le=5)
    commentaire: str | None = None


class CollectionEntryResponse(BaseModel):
    id: int
    statut: Statut
    note: int | None
    commentaire: str | None
    date_ajout: datetime
    item: ItemResponse