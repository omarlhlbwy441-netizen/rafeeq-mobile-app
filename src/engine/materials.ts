"""Rafeeq Game Engine — Material System (PBR, Unlit, Wireframe, Custom Shaders)"""
import * as THREE from "three";

export type MaterialType = "standard" | "unlit" | "wireframe" | "glass" | "metal" | "emissive";

export interface MaterialConfig {
  type: MaterialType;
  color: string | number;
  roughness?: number;
  metalness?: number;
  opacity?: number;
  transparent?: boolean;
  emissive?: string | number;
  emissiveIntensity?: number;
  wireframe?: boolean;
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  metalnessMap?: THREE.Texture;
}

export class MaterialLibrary {
  private materials: Map<string, THREE.Material> = new Map();

  create(name: string, config: MaterialConfig): THREE.Material {
    let material: THREE.Material;

    switch (config.type) {
      case "standard":
        material = new THREE.MeshStandardMaterial({
          color: config.color,
          roughness: config.roughness ?? 0.5,
          metalness: config.metalness ?? 0.0,
          transparent: config.transparent ?? false,
          opacity: config.opacity ?? 1.0,
          wireframe: config.wireframe ?? false,
          map: config.map ?? null,
          normalMap: config.normalMap ?? null,
          roughnessMap: config.roughnessMap ?? null,
          metalnessMap: config.metalnessMap ?? null,
        });
        break;

      case "unlit":
        material = new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: config.transparent ?? false,
          opacity: config.opacity ?? 1.0,
          wireframe: config.wireframe ?? false,
          map: config.map ?? null,
        });
        break;

      case "wireframe":
        material = new THREE.MeshBasicMaterial({
          color: config.color,
          wireframe: true,
        });
        break;

      case "glass":
        material = new THREE.MeshPhysicalMaterial({
          color: config.color,
          metalness: 0.0,
          roughness: 0.0,
          transmission: 0.9,
          thickness: 0.5,
          transparent: true,
          opacity: 0.3,
          ior: 1.5,
        });
        break;

      case "metal":
        material = new THREE.MeshStandardMaterial({
          color: config.color,
          metalness: 1.0,
          roughness: 0.2,
        });
        break;

      case "emissive":
        material = new THREE.MeshStandardMaterial({
          color: config.color,
          emissive: config.emissive ?? config.color,
          emissiveIntensity: config.emissiveIntensity ?? 1.0,
        });
        break;

      default:
        material = new THREE.MeshStandardMaterial({ color: config.color });
    }

    this.materials.set(name, material);
    return material;
  }

  get(name: string): THREE.Material | undefined {
    return this.materials.get(name);
  }

  update(name: string, updates: Partial<MaterialConfig>): boolean {
    const mat = this.materials.get(name);
    if (!mat) return false;

    if (mat instanceof THREE.MeshStandardMaterial) {
      if (updates.color !== undefined) mat.color.set(updates.color);
      if (updates.roughness !== undefined) mat.roughness = updates.roughness;
      if (updates.metalness !== undefined) mat.metalness = updates.metalness;
      if (updates.emissive !== undefined) mat.emissive.set(updates.emissive);
      if (updates.emissiveIntensity !== undefined) mat.emissiveIntensity = updates.emissiveIntensity;
      if (updates.wireframe !== undefined) mat.wireframe = updates.wireframe;
    }

    if (mat instanceof THREE.MeshBasicMaterial) {
      if (updates.color !== undefined) mat.color.set(updates.color);
      if (updates.wireframe !== undefined) mat.wireframe = updates.wireframe;
    }

    mat.needsUpdate = true;
    return true;
  }

  dispose(name: string): void {
    const mat = this.materials.get(name);
    if (mat) {
      mat.dispose();
      this.materials.delete(name);
    }
  }

  disposeAll(): void {
    this.materials.forEach((mat) => mat.dispose());
    this.materials.clear();
  }

  list(): string[] {
    return Array.from(this.materials.keys());
  }
}

// Preset materials
export const MaterialPresets = {
  RafeeqBlue: { type: "standard" as MaterialType, color: 0x6366f1, roughness: 0.4 },
  RafeeqPurple: { type: "standard" as MaterialType, color: 0x8b5cf6, roughness: 0.4 },
  RafeeqGreen: { type: "standard" as MaterialType, color: 0x10b981, roughness: 0.3 },
  RafeeqRed: { type: "standard" as MaterialType, color: 0xef4444, roughness: 0.5 },
  RafeeqGold: { type: "metal" as MaterialType, color: 0xffd700 },
  RafeeqGlass: { type: "glass" as MaterialType, color: 0xffffff },
  RafeeqGlow: { type: "emissive" as MaterialType, color: 0x6366f1, emissiveIntensity: 2.0 },
  Wireframe: { type: "wireframe" as MaterialType, color: 0x00ff00 },
};
