from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

from core.config import DATABASE_URL
from models.collection import CollectionEntry
from models.item import Item
from models.user import User


engine = create_async_engine(
    DATABASE_URL,
    echo=True,
)


session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def create_db_and_tables() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with session_factory() as session:
        yield session