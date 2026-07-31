"""Authentication tests."""
import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_register():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/register", json={
            "email": "test@rafeeq.app",
            "username": "testuser",
            "password": "TestPass123!",
            "full_name": "Test User"
        })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@rafeeq.app"
    assert data["username"] == "testuser"


@pytest.mark.asyncio
async def test_login():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/login", json={
            "username": "testuser",
            "password": "TestPass123!"
        })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
