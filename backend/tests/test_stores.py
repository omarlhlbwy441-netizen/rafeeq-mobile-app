"""Store management tests."""
import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_create_store(client):
    # Register and login first
    await client.post("/api/v1/auth/register", json={
        "email": "merchant@rafeeq.app",
        "username": "merchant",
        "password": "Merchant123!",
    })
    login = await client.post("/api/v1/auth/login", json={
        "username": "merchant",
        "password": "Merchant123!",
    })
    token = login.json()["access_token"]

    # Create store
    response = await client.post(
        "/api/v1/stores/",
        json={"name": "My Store", "slug": "my-store", "description": "Test store"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My Store"
    assert data["slug"] == "my-store"


@pytest.mark.asyncio
async def test_list_stores(client):
    response = await client.get("/api/v1/stores/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
