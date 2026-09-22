from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from dependencies.auth import get_current_user
from dependencies.database import get_session
from models.collection import CollectionEntry
from models.item import Item
from models.user import User
from schemas.collection import (
    CollectionCreateRequest,
    CollectionEntryResponse,
    CollectionUpdateRequest,
)
from schemas.item import ItemResponse


router = APIRouter(
    prefix="/me",
    tags=["Collection"],
)


def build_entry_response(
    entry: CollectionEntry,
    item: Item,
) -> CollectionEntryResponse:
    return CollectionEntryResponse(
        id=entry.id,
        statut=entry.statut,
        note=entry.note,
        commentaire=entry.commentaire,
        date_ajout=entry.date_ajout,
        item=ItemResponse(
            id=item.id,
            titre=item.titre,
            description=item.description,
            categorie=item.categorie,
            image_url=item.image_url,
            temps_preparation=item.temps_preparation,
            difficulte=item.difficulte,
        ),
    )


@router.get(
    "/collection",
    response_model=list[CollectionEntryResponse],
)
async def get_collection(
    statut: str | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> list[CollectionEntryResponse]:
    query = select(CollectionEntry).where(
        CollectionEntry.user_id == current_user.id
    )

    if statut is not None:
        query = query.where(CollectionEntry.statut == statut)

    query = query.order_by(CollectionEntry.date_ajout.desc())

    result = await session.exec(query)
    entries = result.all()

    responses: list[CollectionEntryResponse] = []

    for entry in entries:
        item = await session.get(Item, entry.item_id)

        if item is not None:
            responses.append(
                build_entry_response(entry, item)
            )

    return responses


@router.post(
    "/collection",
    response_model=CollectionEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_to_collection(
    data: CollectionCreateRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> CollectionEntryResponse:
    item = await session.get(Item, data.item_id)

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

    query = select(CollectionEntry).where(
        CollectionEntry.user_id == current_user.id,
        CollectionEntry.item_id == data.item_id,
    )

    result = await session.exec(query)
    existing_entry = result.first()

    if existing_entry is not None:
        raise HTTPException(
            status_code=409,
            detail={
                "erreur": {
                    "code": 409,
                    "message": "Cette recette est déjà dans votre collection",
                }
            },
        )

    entry = CollectionEntry(
        user_id=current_user.id,
        item_id=data.item_id,
        statut=data.statut,
        note=data.note,
        commentaire=data.commentaire,
    )

    session.add(entry)
    await session.commit()
    await session.refresh(entry)

    return build_entry_response(entry, item)


@router.patch(
    "/collection/{entry_id}",
    response_model=CollectionEntryResponse,
)
async def update_collection_entry(
    entry_id: int,
    data: CollectionUpdateRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> CollectionEntryResponse:
    query = select(CollectionEntry).where(
        CollectionEntry.id == entry_id,
        CollectionEntry.user_id == current_user.id,
    )

    result = await session.exec(query)
    entry = result.first()

    if entry is None:
        raise HTTPException(
            status_code=404,
            detail={
                "erreur": {
                    "code": 404,
                    "message": "Entrée de collection introuvable",
                }
            },
        )

    payload = data.model_dump(exclude_unset=True)

    if "statut" in payload:
        entry.statut = payload["statut"]

    if "note" in payload:
        entry.note = payload["note"]

    if "commentaire" in payload:
        entry.commentaire = payload["commentaire"]

    session.add(entry)
    await session.commit()
    await session.refresh(entry)

    item = await session.get(Item, entry.item_id)

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

    return build_entry_response(entry, item)


@router.delete(
    "/collection/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_collection_entry(
    entry_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> None:
    query = select(CollectionEntry).where(
        CollectionEntry.id == entry_id,
        CollectionEntry.user_id == current_user.id,
    )

    result = await session.exec(query)
    entry = result.first()

    if entry is None:
        raise HTTPException(
            status_code=404,
            detail={
                "erreur": {
                    "code": 404,
                    "message": "Entrée de collection introuvable",
                }
            },
        )

    await session.delete(entry)
    await session.commit()