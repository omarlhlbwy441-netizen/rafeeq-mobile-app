"""Rafeeq 3D Game Engine — Unity-like engine powered by Three.js"""
import * as THREE from "three";

export interface EngineConfig {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  antialias?: boolean;
  shadows?: boolean;
  physics?: boolean;
}

export interface GameObject {
  id: string;
  name: string;
  type: "mesh" | "light" | "camera" | "empty" | "particle";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  visible: boolean;
  threeObject: THREE.Object3D;
  parent?: string;
  children: string[];
  components: GameComponent[];
}

export interface GameComponent {
  type: string;
  properties: Record<string, any>;
}

export class RafeeqEngine {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clock: THREE.Clock;
  objects: Map<string, GameObject> = new Map();
  isRunning: boolean = false;
  animationId: number = 0;
  onUpdate?: (delta: number) => void;
  onRender?: () => void;

  constructor(config: EngineConfig) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: config.canvas,
      antialias: config.antialias ?? true,
      alpha: true,
    });
    this.renderer.setSize(config.width, config.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = config.shadows ?? true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    this.scene.fog = new THREE.Fog(0x0a0a0f, 10, 100);

    this.camera = new THREE.PerspectiveCamera(
      75,
      config.width / config.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);

    this.clock = new THREE.Clock();
  }

  // ===== OBJECT MANAGEMENT =====
  createObject(config: Partial<GameObject> & { name: string; type: GameObject["type"] }): GameObject {
    const id = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let threeObject: THREE.Object3D;

    switch (config.type) {
      case "mesh":
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
        threeObject = new THREE.Mesh(geometry, material);
        threeObject.castShadow = true;
        threeObject.receiveShadow = true;
        break;
      case "light":
        threeObject = new THREE.DirectionalLight(0xffffff, 1);
        (threeObject as THREE.DirectionalLight).castShadow = true;
        break;
      case "camera":
        threeObject = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        break;
      case "particle":
        const particleGeo = new THREE.BufferGeometry();
        const count = 1000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 10;
        }
        particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
          color: 0x6366f1,
          size: 0.05,
          transparent: true,
          opacity: 0.8,
        });
        threeObject = new THREE.Points(particleGeo, particleMat);
        break;
      default:
        threeObject = new THREE.Object3D();
    }

    const obj: GameObject = {
      id,
      name: config.name,
      type: config.type,
      position: config.position ?? [0, 0, 0],
      rotation: config.rotation ?? [0, 0, 0],
      scale: config.scale ?? [1, 1, 1],
      visible: config.visible ?? true,
      threeObject,
      children: [],
      components: config.components ?? [],
    };

    threeObject.position.set(...obj.position);
    threeObject.rotation.set(...obj.rotation);
    threeObject.scale.set(...obj.scale);
    threeObject.visible = obj.visible;
    threeObject.userData = { gameObjectId: id };

    this.scene.add(threeObject);
    this.objects.set(id, obj);
    return obj;
  }

  removeObject(id: string): boolean {
    const obj = this.objects.get(id);
    if (!obj) return false;
    this.scene.remove(obj.threeObject);
    obj.threeObject.geometry?.dispose();
    (obj.threeObject as THREE.Mesh).material?.dispose();
    this.objects.delete(id);
    return true;
  }

  getObject(id: string): GameObject | undefined {
    return this.objects.get(id);
  }

  updateObject(id: string, updates: Partial<Pick<GameObject, "position" | "rotation" | "scale" | "visible">>): void {
    const obj = this.objects.get(id);
    if (!obj) return;

    if (updates.position) {
      obj.position = updates.position;
      obj.threeObject.position.set(...updates.position);
    }
    if (updates.rotation) {
      obj.rotation = updates.rotation;
      obj.threeObject.rotation.set(...updates.rotation);
    }
    if (updates.scale) {
      obj.scale = updates.scale;
      obj.threeObject.scale.set(...updates.scale);
    }
    if (updates.visible !== undefined) {
      obj.visible = updates.visible;
      obj.threeObject.visible = updates.visible;
    }
  }

  // ===== LIGHTING =====
  addAmbientLight(color: number = 0x404040, intensity: number = 0.5): THREE.AmbientLight {
    const light = new THREE.AmbientLight(color, intensity);
    this.scene.add(light);
    return light;
  }

  addDirectionalLight(
    color: number = 0xffffff,
    intensity: number = 1,
    position: [number, number, number] = [10, 20, 10]
  ): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...position);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    this.scene.add(light);
    return light;
  }

  addPointLight(
    color: number = 0xffffff,
    intensity: number = 1,
    distance: number = 100,
    position: [number, number, number] = [0, 5, 0]
  ): THREE.PointLight {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(...position);
    light.castShadow = true;
    this.scene.add(light);
    return light;
  }

  // ===== SKYBOX & ENVIRONMENT =====
  setSkybox(color: number | string = "#0a0a0f"): void {
    this.scene.background = new THREE.Color(color);
  }

  setFog(color: number | string = "#0a0a0f", near: number = 10, far: number = 100): void {
    this.scene.fog = new THREE.Fog(color, near, far);
  }

  addGridHelper(size: number = 50, divisions: number = 50, color: number = 0x2a2a3e): THREE.GridHelper {
    const grid = new THREE.GridHelper(size, divisions, color, color);
    grid.position.y = 0;
    this.scene.add(grid);
    return grid;
  }

  // ===== RENDER LOOP =====
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.loop();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private loop = (): void => {
    if (!this.isRunning) return;
    const delta = this.clock.getDelta();
    this.onUpdate?.(delta);
    this.onRender?.();
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.loop);
  };

  // ===== RESIZE =====
  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // ===== EXPORT =====
  exportScene(): object {
    const objects = Array.from(this.objects.values()).map((obj) => ({
      id: obj.id,
      name: obj.name,
      type: obj.type,
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale,
      visible: obj.visible,
      parent: obj.parent,
      children: obj.children,
      components: obj.components,
    }));

    return {
      objects,
      camera: {
        position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
        rotation: [this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z],
        fov: this.camera.fov,
      },
      settings: {
        background: (this.scene.background as THREE.Color)?.getHexString?.(),
        fog: this.scene.fog ? {
          color: (this.scene.fog as THREE.Fog).color.getHexString(),
          near: (this.scene.fog as THREE.Fog).near,
          far: (this.scene.fog as THREE.Fog).far,
        } : null,
      },
    };
  }

  // ===== DISPOSE =====
  dispose(): void {
    this.stop();
    this.objects.forEach((obj) => {
      obj.threeObject.traverse((child) => {
        (child as THREE.Mesh).geometry?.dispose();
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
    });
    this.objects.clear();
    this.renderer.dispose();
  }
}
