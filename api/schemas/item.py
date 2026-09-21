from pydantic import BaseModel


class ItemResponse(BaseModel):
    id: int
    titre: str
    description: str
    categorie: str
    image_url: str | None
    temps_preparation: int
    difficulte: str


class ItemListResponse(BaseModel):
    total: int
    page: int
    limit: int
    results: list[ItemResponse]