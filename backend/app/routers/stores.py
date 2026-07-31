"""Store/Franchise management routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models import Store, User
from app.schemas import StoreCreate, StoreUpdate, StoreResponse
from app.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=StoreResponse, status_code=status.HTTP_201_CREATED)
async def create_store(
    store_data: StoreCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check slug uniqueness
    result = await db.execute(select(Store).where(Store.slug == store_data.slug))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Store slug already exists")

    new_store = Store(
        name=store_data.name,
        slug=store_data.slug,
        description=store_data.description,
        owner_id=current_user.id
    )
    db.add(new_store)
    await db.commit()
    await db.refresh(new_store)
    return new_store


@router.get("/", response_model=List[StoreResponse])
async def list_stores(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Store).where(Store.is_active == True).offset(skip).limit(limit)
    )
    return result.scalars().all()


@router.get("/my", response_model=List[StoreResponse])
async def list_my_stores(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Store).where(Store.owner_id == current_user.id)
    )
    return result.scalars().all()


@router.get("/{store_id}", response_model=StoreResponse)
async def get_store(store_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.patch("/{store_id}", response_model=StoreResponse)
async def update_store(
    store_id: int,
    update_data: StoreUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.owner_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(store, field, value)

    await db.commit()
    await db.refresh(store)
    return store


@router.delete("/{store_id}")
async def delete_store(
    store_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    if store.owner_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    store.is_active = False
    await db.commit()
    return {"message": "Store deactivated"}
