"""Admin-only routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.database import get_db
from app.models import User, Store, Product, SystemLog
from app.schemas import UserResponse
from app.auth import get_current_active_admin

router = APIRouter()


@router.get("/dashboard")
async def admin_dashboard(admin: User = Depends(get_current_active_admin), db: AsyncSession = Depends(get_db)):
    users_count = await db.execute(select(func.count(User.id)))
    stores_count = await db.execute(select(func.count(Store.id)))
    products_count = await db.execute(select(func.count(Product.id)))

    return {
        "total_users": users_count.scalar(),
        "total_stores": stores_count.scalar(),
        "total_products": products_count.scalar(),
        "admin": admin.username
    }


@router.get("/users", response_model=List[UserResponse])
async def list_all_users(
    skip: int = 0,
    limit: int = 100,
    admin: User = Depends(get_current_active_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()


@router.patch("/users/{user_id}/activate")
async def activate_user(
    user_id: int,
    is_active: bool,
    admin: User = Depends(get_current_active_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = is_active
    await db.commit()
    return {"message": f"User {'activated' if is_active else 'deactivated'}"}


@router.get("/logs")
async def get_system_logs(
    level: str = None,
    limit: int = 100,
    admin: User = Depends(get_current_active_admin),
    db: AsyncSession = Depends(get_db)
):
    query = select(SystemLog).order_by(SystemLog.created_at.desc()).limit(limit)
    if level:
        query = query.where(SystemLog.level == level)
    result = await db.execute(query)
    return result.scalars().all()
