"""Rafeeq Game Engine — Prefab System (Unity Prefab architecture)"""
import * as THREE from "three";
import { GameObject, RafeeqComponent, ComponentType } from "./component";

export interface PrefabData {
  id: string;
  name: string;
  tag: string;
  layer: number;
  isStatic: boolean;
  components: Array<{
    type: ComponentType;
    enabled: boolean;
    properties: Record<string, any>;
  }>;
  children: PrefabData[];
}

export class Prefab {
  id: string;
  name: string;
  template: PrefabData;
  isVariant: boolean = false;
  parentPrefab: Prefab | null = null;
  overrides: Map<string, any> = new Map();

  constructor(name: string, source: GameObject | PrefabData) {
    this.id = `prefab_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    this.name = name;

    if (source instanceof GameObject) {
      this.template = this.serializeGameObject(source);
    } else {
      this.template = source;
    }
  }

  private serializeGameObject(go: GameObject): PrefabData {
    return {
      id: go.id,
      name: go.name,
      tag: go.tag,
      layer: go.layer,
      isStatic: go.isStatic,
      components: go.components.map((c) => c.serialize()),
      children: [], // TODO: hierarchical prefabs
    };
  }

  instantiate(position?: [number, number, number], rotation?: [number, number, number], scale?: [number, number, number]): GameObject {
    const go = new GameObject(this.template.name);
    go.tag = this.template.tag;
    go.layer = this.template.layer;
    go.isStatic = this.template.isStatic;

    if (position) go.transform.position.set(...position);
    if (rotation) go.transform.rotation.set(...rotation);
    if (scale) go.transform.scale.set(...scale);

    // Apply components
    this.template.components.forEach((compData) => {
      if (compData.type === "Transform") {
        go.transform.deserialize(compData);
        return;
      }
      // Create component based on type
      const comp = this.createComponentFromData(compData);
      if (comp) {
        go.addComponent(comp);
        comp.deserialize(compData);
      }
    });

    // Apply overrides
    this.overrides.forEach((value, key) => {
      const parts = key.split(".");
      if (parts.length >= 2) {
        const compType = parts[0] as ComponentType;
        const prop = parts[1];
        const comp = go.getComponent(compType);
        if (comp && prop in comp) {
          (comp as any)[prop] = value;
        }
      }
    });

    return go;
  }

  private createComponentFromData(data: any): RafeeqComponent | null {
    // Factory method - would import all component classes
    // Simplified for now
    return null;
  }

  applyOverride(componentType: string, property: string, value: any): void {
    this.overrides.set(`${componentType}.${property}`, value);
  }

  createVariant(name: string): Prefab {
    const variant = new Prefab(name, this.template);
    variant.isVariant = true;
    variant.parentPrefab = this;
    return variant;
  }

  serialize(): PrefabData {
    return { ...this.template };
  }
}

export class PrefabLibrary {
  private prefabs: Map<string, Prefab> = new Map();

  register(name: string, prefab: Prefab): void {
    this.prefabs.set(name, prefab);
  }

  get(name: string): Prefab | undefined {
    return this.prefabs.get(name);
  }

  remove(name: string): void {
    this.prefabs.delete(name);
  }

  list(): string[] {
    return Array.from(this.prefabs.keys());
  }

  // Built-in prefabs
  createCube(name: string = "Cube", color: number = 0x6366f1): Prefab {
    const go = new GameObject(name);
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color })
    );
    go.threeObject.add(mesh);
    const prefab = new Prefab(name, go);
    this.register(name, prefab);
    return prefab;
  }

  createSphere(name: string = "Sphere", color: number = 0x10b981): Prefab {
    const go = new GameObject(name);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({ color })
    );
    go.threeObject.add(mesh);
    const prefab = new Prefab(name, go);
    this.register(name, prefab);
    return prefab;
  }

  createCapsule(name: string = "Capsule", color: number = 0xf59e0b): Prefab {
    const go = new GameObject(name);
    const mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.5, 1, 4, 16),
      new THREE.MeshStandardMaterial({ color })
    );
    go.threeObject.add(mesh);
    const prefab = new Prefab(name, go);
    this.register(name, prefab);
    return prefab;
  }

  createPlane(name: string = "Plane", color: number = 0x64748b): Prefab {
    const go = new GameObject(name);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide })
    );
    mesh.rotation.x = -Math.PI / 2;
    go.threeObject.add(mesh);
    const prefab = new Prefab(name, go);
    this.register(name, prefab);
    return prefab;
  }

  createLight(name: string = "Light", type: "directional" | "point" | "spot" = "directional"): Prefab {
    const go = new GameObject(name);
    let light: THREE.Light;
    switch (type) {
      case "directional": light = new THREE.DirectionalLight(0xffffff, 1); break;
      case "point": light = new THREE.PointLight(0xffffff, 1, 100); break;
      case "spot": light = new THREE.SpotLight(0xffffff, 1); break;
    }
    go.threeObject.add(light);
    const prefab = new Prefab(name, go);
    this.register(name, prefab);
    return prefab;
  }

  createCamera(name: string = "Main Camera"): Prefab {
    const go = new GameObject(name);
    const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
    camera.position.set(0, 5, 10);
    go.threeObject.add(camera);
    const prefab = new Prefab(name, go);
    this.register(name, prefab);
    return prefab;
  }

  createParticleSystem(name: string = "Particle System"): Prefab {
    const go = new GameObject(name);
    const count = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
      sizes[i] = Math.random() * 0.1 + 0.02;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    go.threeObject.add(particles);
    const prefab = new Prefab(name, go);
    this.register(name, prefab);
    return prefab;
  }
}
