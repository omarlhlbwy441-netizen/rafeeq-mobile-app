"""Product management tests."""
import pytest


@pytest.mark.asyncio
async def test_create_product(client):
    # Setup: register, login, create store
    await client.post("/api/v1/auth/register", json={
        "email": "seller@rafeeq.app",
        "username": "seller",
        "password": "Seller123!",
    })
    login = await client.post("/api/v1/auth/login", json={
        "username": "seller",
        "password": "Seller123!",
    })
    token = login.json()["access_token"]

    store = await client.post(
        "/api/v1/stores/",
        json={"name": "Tech Store", "slug": "tech-store"},
        headers={"Authorization": f"Bearer {token}"}
    )
    store_id = store.json()["id"]

    # Create product
    response = await client.post(
        f"/api/v1/products/?store_id={store_id}",
        json={"name": "iPhone 15", "price": 999.99, "stock": 10},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "iPhone 15"
    assert data["price"] == 999.99
