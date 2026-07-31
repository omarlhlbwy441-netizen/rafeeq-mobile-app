"""Health check endpoint."""
from fastapi import APIRouter
from datetime import datetime, timezone
import aioredis
import asyncpg

from app.config import get_settings
from app.schemas import HealthResponse

router = APIRouter()
settings = get_settings()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    db_status = "connected"
    redis_status = "connected"

    # Test DB
    try:
        conn = await asyncpg.connect(settings.DATABASE_URL)
        await conn.fetchval("SELECT 1")
        await conn.close()
    except Exception:
        db_status = "disconnected"

    # Test Redis
    try:
        redis = aioredis.from_url(settings.REDIS_URL)
        await redis.ping()
        await redis.close()
    except Exception:
        redis_status = "disconnected"

    return HealthResponse(
        status="healthy" if db_status == "connected" and redis_status == "connected" else "degraded",
        version="3.0.0",
        environment=settings.ENVIRONMENT,
        database=db_status,
        redis=redis_status,
        timestamp=datetime.now(timezone.utc)
    )
