from collections.abc import AsyncGenerator

from sqlmodel.ext.asyncio.session import AsyncSession

from db.database import engine


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session