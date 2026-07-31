"""Game Engine routes — Unity-like 3D game builder."""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.database import get_db
from app.models import GameProject, GameScene, GameAsset, User
from app.schemas import (
    GameProjectCreate, GameProjectUpdate, GameProjectResponse,
    GameSceneCreate, GameSceneUpdate, GameSceneResponse,
    GameAssetCreate, GameAssetUpdate, GameAssetResponse
)
from app.auth import get_current_user

router = APIRouter()


# ========== PROJECTS ==========

@router.post("/projects", response_model=GameProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: GameProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(GameProject).where(GameProject.slug == project_data.slug))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Project slug already exists")

    new_project = GameProject(
        name=project_data.name,
        slug=project_data.slug,
        description=project_data.description,
        owner_id=current_user.id,
        settings={
            "resolution": {"width": 1920, "height": 1080},
            "render_quality": "high",
            "physics_engine": "cannon",
            "shadows": True,
            "antialiasing": True,
        }
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return new_project


@router.get("/projects", response_model=List[GameProjectResponse])
async def list_projects(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(GameProject)
        .where((GameProject.is_public == True) | (GameProject.is_published == True))
        .offset(skip).limit(limit)
    )
    return result.scalars().all()


@router.get("/projects/my", response_model=List[GameProjectResponse])
async def list_my_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(GameProject).where(GameProject.owner_id == current_user.id)
    )
    return result.scalars().all()


@router.get("/projects/{project_id}", response_model=GameProjectResponse)
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GameProject).where(GameProject.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/projects/{project_id}", response_model=GameProjectResponse)
async def update_project(
    project_id: int,
    update_data: GameProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(GameProject).where(GameProject.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(GameProject).where(GameProject.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    await db.delete(project)
    await db.commit()
    return {"message": "Project deleted"}


# ========== SCENES ==========

@router.post("/projects/{project_id}/scenes", response_model=GameSceneResponse, status_code=status.HTTP_201_CREATED)
async def create_scene(
    project_id: int,
    scene_data: GameSceneCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(GameProject).where(GameProject.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    new_scene = GameScene(
        name=scene_data.name,
        project_id=project_id,
        is_main=scene_data.is_main,
        physics_enabled=scene_data.physics_enabled,
        scene_data={
            "objects": [],
            "skybox": None,
            "fog": {"enabled": False, "color": "#000000", "near": 1, "far": 1000},
        },
        camera_data={
            "type": "perspective",
            "position": [0, 5, 10],
            "rotation": [0, 0, 0],
            "fov": 75,
            "near": 0.1,
            "far": 1000,
        },
        lighting_data={
            "ambient": {"color": "#404040", "intensity": 0.5},
            "directional": [
                {"color": "#ffffff", "intensity": 1.0, "position": [10, 20, 10]}
            ],
            "point": [],
            "spot": [],
        },
    )
    db.add(new_scene)
    await db.commit()
    await db.refresh(new_scene)
    return new_scene


@router.get("/projects/{project_id}/scenes", response_model=List[GameSceneResponse])
async def list_scenes(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(GameScene).where(GameScene.project_id == project_id)
    )
    return result.scalars().all()


@router.get("/scenes/{scene_id}", response_model=GameSceneResponse)
async def get_scene(scene_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GameScene).where(GameScene.id == scene_id))
    scene = result.scalar_one_or_none()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    return scene


@router.patch("/scenes/{scene_id}", response_model=GameSceneResponse)
async def update_scene(
    scene_id: int,
    update_data: GameSceneUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(GameScene).join(GameProject).where(GameScene.id == scene_id)
    )
    scene = result.scalar_one_or_none()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    if scene.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(scene, field, value)

    await db.commit()
    await db.refresh(scene)
    return scene


@router.delete("/scenes/{scene_id}")
async def delete_scene(
    scene_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(GameScene).join(GameProject).where(GameScene.id == scene_id)
    )
    scene = result.scalar_one_or_none()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    if scene.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    await db.delete(scene)
    await db.commit()
    return {"message": "Scene deleted"}


# ========== ASSETS ==========

@router.post("/projects/{project_id}/assets", response_model=GameAssetResponse, status_code=status.HTTP_201_CREATED)
async def create_asset(
    project_id: int,
    asset_data: GameAssetCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(GameProject).where(GameProject.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    new_asset = GameAsset(
        name=asset_data.name,
        asset_type=asset_data.asset_type,
        project_id=project_id,
        metadata={}
    )
    db.add(new_asset)
    await db.commit()
    await db.refresh(new_asset)
    return new_asset


@router.get("/projects/{project_id}/assets", response_model=List[GameAssetResponse])
async def list_assets(
    project_id: int,
    asset_type: str = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(GameAsset).where(GameAsset.project_id == project_id)
    if asset_type:
        query = query.where(GameAsset.asset_type == asset_type)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/assets/{asset_id}", response_model=GameAssetResponse)
async def get_asset(asset_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GameAsset).where(GameAsset.id == asset_id))
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.delete("/assets/{asset_id}")
async def delete_asset(
    asset_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(GameAsset).join(GameProject).where(GameAsset.id == asset_id)
    )
    asset = result.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    await db.delete(asset)
    await db.commit()
    return {"message": "Asset deleted"}
