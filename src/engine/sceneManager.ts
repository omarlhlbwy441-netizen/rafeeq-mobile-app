"""Rafeeq Game Engine — Scene Manager (Unity SceneManager architecture)"""
import * as THREE from "three";
import { GameObject } from "./component";

export interface SceneData {
  name: string;
  buildIndex: number;
  path: string;
  isLoaded: boolean;
  rootCount: number;
}

export class RafeeqScene {
  name: string;
  buildIndex: number;
  path: string;
  threeScene: THREE.Scene;
  rootObjects: GameObject[] = [];
  isLoaded: boolean = false;
  isActive: boolean = false;
  ambientLight: THREE.AmbientLight;
  fog: THREE.Fog | null = null;
  skybox: THREE.CubeTexture | null = null;
  gravity: THREE.Vector3 = new THREE.Vector3(0, -9.81, 0);
  physicsEnabled: boolean = true;
  timeScale: number = 1.0;

  constructor(name: string, buildIndex: number = -1) {
    this.name = name;
    this.buildIndex = buildIndex;
    this.path = `Assets/Scenes/${name}.scene`;
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x0a0a0f);

    this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.threeScene.add(this.ambientLight);
  }

  addRootObject(go: GameObject): void {
    go.scene = this.threeScene;
    this.threeScene.add(go.threeObject);
    this.rootObjects.push(go);
  }

  removeRootObject(go: GameObject): void {
    const index = this.rootObjects.indexOf(go);
    if (index > -1) {
      this.threeScene.remove(go.threeObject);
      this.rootObjects.splice(index, 1);
    }
  }

  findObject(name: string): GameObject | null {
    return this.rootObjects.find((go) => go.name === name) ?? null;
  }

  findObjectsWithTag(tag: string): GameObject[] {
    return this.rootObjects.filter((go) => go.tag === tag);
  }

  findObjectOfType<T>(type: string): T | null {
    for (const go of this.rootObjects) {
      const comp = go.getComponent(type as any);
      if (comp) return comp as unknown as T;
    }
    return null;
  }

  findObjectsOfType<T>(type: string): T[] {
    const results: T[] = [];
    for (const go of this.rootObjects) {
      const comps = go.getComponents(type as any);
      results.push(...(comps as unknown as T[]));
    }
    return results;
  }

  setSkybox(color: number | string): void {
    this.threeScene.background = new THREE.Color(color);
  }

  setFog(color: number | string, near: number = 10, far: number = 100): void {
    this.fog = new THREE.Fog(color, near, far);
    this.threeScene.fog = this.fog;
  }

  setGravity(x: number, y: number, z: number): void {
    this.gravity.set(x, y, z);
  }

  serialize(): object {
    return {
      name: this.name,
      buildIndex: this.buildIndex,
      path: this.path,
      rootObjects: this.rootObjects.map((go) => go.serialize()),
      ambientLight: {
        color: this.ambientLight.color.getHex(),
        intensity: this.ambientLight.intensity,
      },
      fog: this.fog ? {
        color: this.fog.color.getHex(),
        near: this.fog.near,
        far: this.fog.far,
      } : null,
      gravity: [this.gravity.x, this.gravity.y, this.gravity.z],
      physicsEnabled: this.physicsEnabled,
      timeScale: this.timeScale,
    };
  }
}

export class SceneManager {
  private static scenes: Map<string, RafeeqScene> = new Map();
  private static activeScene: RafeeqScene | null = null;
  private static buildSettings: string[] = [];
  private static onSceneLoaded: ((scene: RafeeqScene, mode: "single" | "additive") => void)[] = [];
  private static onSceneUnloaded: ((scene: RafeeqScene) => void)[] = [];

  static createScene(name: string): RafeeqScene {
    const scene = new RafeeqScene(name, this.buildSettings.length);
    this.scenes.set(name, scene);
    this.buildSettings.push(name);
    return scene;
  }

  static loadScene(name: string, mode: "single" | "additive" = "single"): RafeeqScene {
    const scene = this.scenes.get(name);
    if (!scene) throw new Error(`Scene '${name}' not found`);

    if (mode === "single" && this.activeScene) {
      this.unloadScene(this.activeScene.name);
    }

    scene.isLoaded = true;
    scene.isActive = true;
    if (mode === "single") {
      this.activeScene = scene;
    }

    // Awake all objects
    scene.rootObjects.forEach((go) => {
      go.components.forEach((c) => c.awake());
    });

    // Start all objects
    scene.rootObjects.forEach((go) => {
      go.components.forEach((c) => c.start());
    });

    this.onSceneLoaded.forEach((cb) => cb(scene, mode));
    return scene;
  }

  static unloadScene(name: string): void {
    const scene = this.scenes.get(name);
    if (!scene) return;

    scene.rootObjects.forEach((go) => go.destroy());
    scene.rootObjects = [];
    scene.isLoaded = false;
    scene.isActive = false;

    if (this.activeScene === scene) {
      this.activeScene = null;
    }

    this.onSceneUnloaded.forEach((cb) => cb(scene));
  }

  static getActiveScene(): RafeeqScene | null {
    return this.activeScene;
  }

  static getSceneByName(name: string): RafeeqScene | null {
    return this.scenes.get(name) ?? null;
  }

  static getSceneByBuildIndex(index: number): RafeeqScene | null {
    const name = this.buildSettings[index];
    return name ? this.scenes.get(name) ?? null : null;
  }

  static getSceneCount(): number {
    return this.scenes.size;
  }

  static getAllScenes(): RafeeqScene[] {
    return Array.from(this.scenes.values());
  }

  static addSceneToBuildSettings(name: string): void {
    if (!this.buildSettings.includes(name)) {
      this.buildSettings.push(name);
    }
  }

  static getBuildSettings(): string[] {
    return [...this.buildSettings];
  }

  static registerSceneLoaded(callback: (scene: RafeeqScene, mode: "single" | "additive") => void): void {
    this.onSceneLoaded.push(callback);
  }

  static registerSceneUnloaded(callback: (scene: RafeeqScene) => void): void {
    this.onSceneUnloaded.push(callback);
  }

  static update(deltaTime: number): void {
    this.scenes.forEach((scene) => {
      if (scene.isActive) {
        scene.rootObjects.forEach((go) => {
          if (go.isActive) {
            go.components.forEach((c) => {
              if (c.enabled) c.update(deltaTime * scene.timeScale);
            });
          }
        });
      }
    });
  }

  static fixedUpdate(fixedDeltaTime: number): void {
    this.scenes.forEach((scene) => {
      if (scene.isActive && scene.physicsEnabled) {
        scene.rootObjects.forEach((go) => {
          if (go.isActive) {
            go.components.forEach((c) => {
              if (c.enabled) c.fixedUpdate(fixedDeltaTime * scene.timeScale);
            });
          }
        });
      }
    });
  }

  static lateUpdate(deltaTime: number): void {
    this.scenes.forEach((scene) => {
      if (scene.isActive) {
        scene.rootObjects.forEach((go) => {
          if (go.isActive) {
            go.components.forEach((c) => {
              if (c.enabled) c.lateUpdate(deltaTime * scene.timeScale);
            });
          }
        });
      }
    });
  }
}
