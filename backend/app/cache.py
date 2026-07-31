"""Redis caching utilities."""
import json
import pickle
from typing import Optional, Any
import aioredis

from app.config import get_settings

settings = get_settings()
redis_client: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    global redis_client
    if redis_client is None:
        redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    return redis_client


async def cache_get(key: str) -> Optional[Any]:
    redis = await get_redis()
    value = await redis.get(key)
    if value:
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return None


async def cache_set(key: str, value: Any, expire: int = 300):
    redis = await get_redis()
    if isinstance(value, (dict, list)):
        value = json.dumps(value)
    await redis.set(key, value, ex=expire)


async def cache_delete(key: str):
    redis = await get_redis()
    await redis.delete(key)


async def cache_flush():
    redis = await get_redis()
    await redis.flushdb()


def cache_key(prefix: str, *args) -> str:
    return f"{prefix}:{':'.join(str(a) for a in args)}"
