"""Game Engine API tests."""
import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_create_game_project(client):
    # Register and login
    await client.post("/api/v1/auth/register", json={
        "email": "gamedev@rafeeq.app",
        "username": "gamedev",
        "password": "GameDev123!",
    })
    login = await client.post("/api/v1/auth/login", json={
        "username": "gamedev",
        "password": "GameDev123!",
    })
    token = login.json()["access_token"]

    # Create project
    response = await client.post(
        "/api/v1/games/projects",
        json={"name": "My 3D Game", "slug": "my-3d-game", "description": "A Unity-like game"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My 3D Game"
    assert data["slug"] == "my-3d-game"
    assert data["settings"]["render_quality"] == "high"


@pytest.mark.asyncio
async def test_list_game_projects(client):
    response = await client.get("/api/v1/games/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_scene(client):
    await client.post("/api/v1/auth/register", json={
        "email": "scenedev@rafeeq.app",
        "username": "scenedev",
        "password": "SceneDev123!",
    })
    login = await client.post("/api/v1/auth/login", json={
        "username": "scenedev",
        "password": "SceneDev123!",
    })
    token = login.json()["access_token"]

    # Create project first
    proj = await client.post(
        "/api/v1/games/projects",
        json={"name": "Scene Test", "slug": "scene-test"},
        headers={"Authorization": f"Bearer {token}"}
    )
    proj_id = proj.json()["id"]

    # Create scene
    response = await client.post(
        f"/api/v1/games/projects/{proj_id}/scenes",
        json={"name": "Level 1", "is_main": True, "physics_enabled": True},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Level 1"
    assert data["is_main"] == True
    assert "camera_data" in data
    assert "lighting_data" in data


@pytest.mark.asyncio
async def test_create_asset(client):
    await client.post("/api/v1/auth/register", json={
        "email": "assetdev@rafeeq.app",
        "username": "assetdev",
        "password": "AssetDev123!",
    })
    login = await client.post("/api/v1/auth/login", json={
        "username": "assetdev",
        "password": "AssetDev123!",
    })
    token = login.json()["access_token"]

    proj = await client.post(
        "/api/v1/games/projects",
        json={"name": "Asset Test", "slug": "asset-test"},
        headers={"Authorization": f"Bearer {token}"}
    )
    proj_id = proj.json()["id"]

    response = await client.post(
        f"/api/v1/games/projects/{proj_id}/assets",
        json={"name": "Hero Mesh", "asset_type": "mesh"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Hero Mesh"
    assert data["asset_type"] == "mesh"
