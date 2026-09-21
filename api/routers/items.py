from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import func, select
from sqlmodel.ext.asyncio.session import AsyncSession

from dependencies.database import get_session
from models.item import Item
from schemas.item import ItemListResponse, ItemResponse

router = APIRouter(
    prefix="/items",
    tags=["Recettes"],
)


@router.get(
    "",
    response_model=ItemListResponse,
)
async def get_items(
    q: str | None = Query(default=None),
    categorie: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
) -> ItemListResponse:
    query = select(Item)

    if q is not None and q.strip() != "":
        search = f"%{q.strip()}%"
        query = query.where(
            (Item.titre.ilike(search))
            | (Item.description.ilike(search))
        )

    if categorie is not None and categorie.strip() != "":
        query = query.where(Item.categorie == categorie.strip())

    count_query = select(func.count()).select_from(query.subquery())
    count_result = await session.exec(count_query)
    total = count_result.one()

    offset = (page - 1) * limit

    query = query.offset(offset).limit(limit)
    query = query.order_by(Item.titre)

    result = await session.exec(query)
    items = result.all()

    return ItemListResponse(
        total=total,
        page=page,
        limit=limit,
        results=items,
    )


@router.get(
    "/{item_id}",
    response_model=ItemResponse,
)
async def get_item(
    item_id: int,
    session: AsyncSession = Depends(get_session),
) -> Item:
    item = await session.get(Item, item_id)

    if item is None:
        raise HTTPException(
            status_code=404,
            detail={
                "erreur": {
                    "code": 404,
                    "message": "Recette introuvable",
                }
            },
        )

    return item