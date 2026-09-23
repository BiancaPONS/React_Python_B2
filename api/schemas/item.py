from pydantic import BaseModel, ConfigDict


class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    titre: str
    description: str
    ingredients: str
    preparation: str
    categorie: str
    image_url: str | None
    temps_preparation: int
    difficulte: str


class ItemListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total: int
    page: int
    limit: int
    results: list[ItemResponse]