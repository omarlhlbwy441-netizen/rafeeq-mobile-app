"""Rafeeq API v3.1.0 — FastAPI Production Backend with 3D Game Engine."""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from app.config import get_settings
from app.database import engine, Base
from app.routers import auth, users, stores, products, admin, health, games
from app.middleware import LoggingMiddleware, SecurityHeadersMiddleware, RateLimitMiddleware

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="رفيق API",
    description="""
    Rafeeq — Your Intelligent AI Companion with Unity-like 3D Game Engine.

    ## Features
    - **JWT Authentication** with refresh tokens
    - **Store/Franchise System** for merchants
    - **Product Catalog** management
    - **Admin Dashboard** with analytics
    - **3D Game Engine** — Unity-like project/scene/asset system
    - **PostgreSQL + Redis** backend

    ## Authentication
    Use the `/api/v1/auth/login` endpoint to get a token, then include it in the
    `Authorization: Bearer <token>` header for protected endpoints.
    """,
    version="3.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
)

# Middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, max_requests=200, window=60)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else [
        "https://rafeeq.app",
        "https://*.vercel.app",
        "http://localhost:19006",
        "exp://localhost:19000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=600,
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(stores.router, prefix="/api/v1/stores", tags=["Stores"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(games.router, prefix="/api/v1/games", tags=["Game Engine"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(health.router, prefix="", tags=["Health"])


@app.get("/")
async def root():
    return {
        "name": "رفيق API",
        "version": "3.1.0",
        "status": "operational",
        "message": "Your intelligent AI companion is online.",
        "features": ["auth", "stores", "products", "games", "admin"],
        "documentation": "/docs" if settings.ENVIRONMENT != "production" else None,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.get("/api/v1")
async def api_info():
    return {
        "version": "3.1.0",
        "endpoints": {
            "auth": "/api/v1/auth",
            "users": "/api/v1/users",
            "stores": "/api/v1/stores",
            "products": "/api/v1/products",
            "games": "/api/v1/games",
            "admin": "/api/v1/admin",
            "health": "/health"
        }
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "path": str(request.url.path)
        }
    )
