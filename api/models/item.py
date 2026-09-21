from sqlmodel import Field, SQLModel


class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titre: str
    description: str
    categorie: str = Field(index=True)
    image_url: str | None = None
    temps_preparation: int
    difficulte: str