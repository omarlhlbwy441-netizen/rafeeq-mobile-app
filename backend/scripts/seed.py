"""Seed script for initial database data."""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal, engine, Base
from app.models import User, Store, Product
from app.auth import get_password_hash
from app.config import get_settings

settings = get_settings()


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Create admin user
        admin = User(
            email="admin@rafeeq.app",
            username="admin",
            hashed_password=get_password_hash("Admin123!"),
            full_name="System Admin",
            role="admin",
            is_active=True,
            is_verified=True,
        )
        db.add(admin)

        # Create demo merchant
        merchant = User(
            email="merchant@rafeeq.app",
            username="merchant",
            hashed_password=get_password_hash("Merchant123!"),
            full_name="Demo Merchant",
            role="merchant",
            is_active=True,
        )
        db.add(merchant)
        await db.flush()

        # Create demo store
        store = Store(
            name="Rafeeq Digital Store",
            slug="rafeeq-digital",
            description="Official Rafeeq merchandise and digital products",
            owner_id=merchant.id,
            is_active=True,
            commission_rate=3.0,
        )
        db.add(store)
        await db.flush()

        # Create demo products
        products = [
            Product(name="Rafeeq Premium Plan", description="Full access to all AI features", price=29.99, stock=999, store_id=store.id),
            Product(name="Wolf T-Shirt", description="Limited edition Wolf Digital Kingdom tee", price=24.99, stock=50, store_id=store.id),
            Product(name="AI Consulting Hour", description="1-on-1 AI strategy session", price=149.99, stock=10, store_id=store.id),
        ]
        db.add_all(products)

        await db.commit()
        print("✅ Database seeded successfully!")
        print("   Admin: admin@rafeeq.app / Admin123!")
        print("   Merchant: merchant@rafeeq.app / Merchant123!")


if __name__ == "__main__":
    asyncio.run(seed())
