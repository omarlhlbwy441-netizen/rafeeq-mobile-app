"""Pagination helpers for API responses."""
from typing import TypeVar, Generic, List
from pydantic import BaseModel
from sqlalchemy import Select
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool


async def paginate(
    db: AsyncSession,
    query: Select,
    page: int = 1,
    page_size: int = 20
) -> PaginatedResponse:
    """Paginate a SQLAlchemy query."""

    # Get total count
    count_query = query.with_only_columns(query.selected_columns[0]).order_by(None)
    from sqlalchemy import func
    total_result = await db.execute(
        count_query.with_only_columns(func.count())
    )
    total = total_result.scalar()

    # Get paginated items
    offset = (page - 1) * page_size
    items_query = query.offset(offset).limit(page_size)
    result = await db.execute(items_query)
    items = result.scalars().all()

    total_pages = (total + page_size - 1) // page_size

    return PaginatedResponse(
        items=list(items),
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1,
    )
