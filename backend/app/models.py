"""SQLAlchemy ORM models."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MERCHANT = "merchant"
    USER = "user"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    stores = relationship("Store", back_populates="owner")
    sessions = relationship("UserSession", back_populates="user")
    game_projects = relationship("GameProject", back_populates="owner")


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    logo_url = Column(String(500))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    commission_rate = Column(Float, default=5.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="stores")
    products = relationship("Product", back_populates="store")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    image_url = Column(String(500))
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    store = relationship("Store", back_populates="products")


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_jti = Column(String(255), unique=True, index=True, nullable=False)
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="sessions")


class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(20), default="INFO")
    source = Column(String(100))
    message = Column(Text, nullable=False)
    metadata_json = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ===== GAME ENGINE MODELS =====

class GameProject(Base):
    __tablename__ = "game_projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=False)
    is_published = Column(Boolean, default=False)
    thumbnail_url = Column(String(500))
    settings = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="game_projects")
    scenes = relationship("GameScene", back_populates="project", cascade="all, delete-orphan")
    assets = relationship("GameAsset", back_populates="project", cascade="all, delete-orphan")


class GameScene(Base):
    __tablename__ = "game_scenes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    project_id = Column(Integer, ForeignKey("game_projects.id"), nullable=False)
    is_main = Column(Boolean, default=False)
    scene_data = Column(JSON, default={})  # Three.js scene graph JSON
    camera_data = Column(JSON, default={})
    lighting_data = Column(JSON, default={})
    physics_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    project = relationship("GameProject", back_populates="scenes")


class GameAsset(Base):
    __tablename__ = "game_assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    asset_type = Column(String(50), nullable=False)  # mesh, texture, material, audio, script, animation, particle
    project_id = Column(Integer, ForeignKey("game_projects.id"), nullable=False)
    file_url = Column(String(500))
    file_size = Column(Integer)
    metadata = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("GameProject", back_populates="assets")
