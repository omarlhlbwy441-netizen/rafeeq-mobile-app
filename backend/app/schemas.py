"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models import UserRole


# Auth schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenPayload(BaseModel):
    sub: Optional[int] = None
    jti: Optional[str] = None
    type: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Store schemas
class StoreBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None

class StoreCreate(StoreBase):
    pass

class StoreUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    is_active: Optional[bool] = None

class StoreResponse(StoreBase):
    id: int
    owner_id: int
    logo_url: Optional[str]
    is_active: bool
    commission_rate: float
    created_at: datetime

    class Config:
        from_attributes = True


# Product schemas
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    stock: int = Field(default=0, ge=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    store_id: int
    image_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Health schema
class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    database: str
    redis: str
    timestamp: datetime


# ===== GAME ENGINE SCHEMAS =====

class GameProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None

class GameProjectCreate(GameProjectBase):
    pass

class GameProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    is_published: Optional[bool] = None
    thumbnail_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class GameProjectResponse(GameProjectBase):
    id: int
    owner_id: int
    is_public: bool
    is_published: bool
    thumbnail_url: Optional[str]
    settings: Dict[str, Any]
    created_at: datetime
    updated_at: Optional[datetime]
    scene_count: int = 0
    asset_count: int = 0

    class Config:
        from_attributes = True


class GameSceneBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    is_main: bool = False
    physics_enabled: bool = True

class GameSceneCreate(GameSceneBase):
    pass

class GameSceneUpdate(BaseModel):
    name: Optional[str] = None
    scene_data: Optional[Dict[str, Any]] = None
    camera_data: Optional[Dict[str, Any]] = None
    lighting_data: Optional[Dict[str, Any]] = None
    physics_enabled: Optional[bool] = None
    is_main: Optional[bool] = None

class GameSceneResponse(GameSceneBase):
    id: int
    project_id: int
    scene_data: Dict[str, Any]
    camera_data: Dict[str, Any]
    lighting_data: Dict[str, Any]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class GameAssetBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    asset_type: str = Field(..., pattern="^(mesh|texture|material|audio|script|animation|particle)$")

class GameAssetCreate(GameAssetBase):
    pass

class GameAssetUpdate(BaseModel):
    name: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class GameAssetResponse(GameAssetBase):
    id: int
    project_id: int
    file_url: Optional[str]
    file_size: Optional[int]
    metadata: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
