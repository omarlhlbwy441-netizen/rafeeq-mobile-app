"""Rafeeq API v3.0.0 — FastAPI Production Backend."""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from datetime import datetime, timezone
import aioredis
import asyncpg

from app.config import get_settings
from app.database import engine, Base
from app.routers import auth, users, stores, products, admin, health

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="رفيق API",
    description="Rafeeq — Your Intelligent AI Companion. Production Backend v3.0.0",
    version="3.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else [
        "https://rafeeq.app",
        "https://*.vercel.app",
        "http://localhost:19006",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(stores.router, prefix="/api/v1/stores", tags=["Stores"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(health.router, prefix="", tags=["Health"])


@app.get("/")
async def root():
    return {
        "name": "رفيق API",
        "version": "3.0.0",
        "status": "operational",
        "message": "Your intelligent AI companion is online.",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error", "timestamp": datetime.now(timezone.utc).isoformat()}
    )
