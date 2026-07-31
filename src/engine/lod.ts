"""Rafeeq Game Engine — LOD System (Unity LODGroup architecture)"""
import * as THREE from "three";

export interface LODLevel {
  screenRelativeHeight: number;
  renderer: THREE.Mesh;
  triangleCount: number;
}

export class RafeeqLOD {
  levels: LODLevel[] = [];
  currentLevel: number = 0;
  private camera: THREE.Camera | null = null;
  private object: THREE.Object3D | null = null;
  fadeMode: "none" | "crossFade" = "none";
  animateCrossFading: boolean = false;

  constructor(camera: THREE.Camera) {
    this.camera = camera;
  }

  addLevel(mesh: THREE.Mesh, screenRelativeHeight: number): void {
    this.levels.push({
      screenRelativeHeight,
      renderer: mesh,
      triangleCount: mesh.geometry.index ? mesh.geometry.index.count / 3 : mesh.geometry.attributes.position.count / 3,
    });
    // Sort by screen height descending (highest detail first)
    this.levels.sort((a, b) => b.screenRelativeHeight - a.screenRelativeHeight);
  }

  setObject(object: THREE.Object3D): void {
    this.object = object;
  }

  update(cameraPosition: THREE.Vector3): void {
    if (!this.object || !this.camera || this.levels.length === 0) return;

    const distance = this.object.position.distanceTo(cameraPosition);
    const screenHeight = this.calculateScreenHeight(distance);

    // Find appropriate LOD level
    let newLevel = this.levels.length - 1;
    for (let i = 0; i < this.levels.length; i++) {
      if (screenHeight >= this.levels[i].screenRelativeHeight) {
        newLevel = i;
        break;
      }
    }

    if (newLevel !== this.currentLevel) {
      this.switchLevel(newLevel);
    }
  }

  private calculateScreenHeight(distance: number): number {
    // Simplified screen height calculation
    // In production, use actual camera projection
    const objectSize = 2; // Approximate object size
    const fov = 75 * (Math.PI / 180);
    const screenHeight = (objectSize / (2 * distance * Math.tan(fov / 2)));
    return Math.min(1, Math.max(0, screenHeight));
  }

  private switchLevel(newLevel: number): void {
    if (this.fadeMode === "crossFade") {
      this.crossFade(newLevel);
    } else {
      this.levels[this.currentLevel].renderer.visible = false;
      this.levels[newLevel].renderer.visible = true;
    }
    this.currentLevel = newLevel;
  }

  private crossFade(newLevel: number): void {
    const oldMesh = this.levels[this.currentLevel].renderer;
    const newMesh = this.levels[newLevel].renderer;

    newMesh.visible = true;
    newMesh.material = (newMesh.material as THREE.Material).clone();
    (newMesh.material as THREE.MeshStandardMaterial).transparent = true;
    (newMesh.material as THREE.MeshStandardMaterial).opacity = 0;

    // Animate fade
    const duration = 0.5;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const t = Math.min(1, elapsed / duration);

      (oldMesh.material as THREE.MeshStandardMaterial).opacity = 1 - t;
      (newMesh.material as THREE.MeshStandardMaterial).opacity = t;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        oldMesh.visible = false;
        (oldMesh.material as THREE.MeshStandardMaterial).opacity = 1;
        (newMesh.material as THREE.MeshStandardMaterial).transparent = false;
      }
    };
    animate();
  }

  recalculateBounds(): void {
    // Recalculate bounding sphere for culling
  }

  getCurrentTriangleCount(): number {
    return this.levels[this.currentLevel]?.triangleCount ?? 0;
  }

  getTotalTriangleCount(): number {
    return this.levels.reduce((sum, level) => sum + level.triangleCount, 0);
  }
}

export class LODGroup {
  private lods: Map<string, RafeeqLOD> = new Map();

  addLOD(id: string, lod: RafeeqLOD): void {
    this.lods.set(id, lod);
  }

  updateAll(cameraPosition: THREE.Vector3): void {
    this.lods.forEach((lod) => lod.update(cameraPosition));
  }

  getLOD(id: string): RafeeqLOD | undefined {
    return this.lods.get(id);
  }

  getTotalTriangles(): number {
    let total = 0;
    this.lods.forEach((lod) => {
      total += lod.getCurrentTriangleCount();
    });
    return total;
  }
}
