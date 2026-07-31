"""Rafeeq Game Engine — Component System (Unity MonoBehaviour architecture)"""
import * as THREE from "three";

export type ComponentType = 
  | "Transform" | "MeshRenderer" | "Camera" | "Light" 
  | "Rigidbody" | "Collider" | "Animator" | "AudioSource"
  | "ParticleSystem" | "Script" | "NavMeshAgent" | "LODGroup"
  | "Canvas" | "UIElement" | "PostProcessVolume";

export interface ComponentData {
  type: ComponentType;
  enabled: boolean;
  properties: Record<string, any>;
}

export abstract class RafeeqComponent {
  id: string;
  type: ComponentType;
  enabled: boolean = true;
  gameObject: GameObject | null = null;

  constructor(type: ComponentType) {
    this.id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    this.type = type;
  }

  // Unity-like lifecycle methods
  awake(): void {}
  start(): void {}
  update(deltaTime: number): void {}
  fixedUpdate(fixedDeltaTime: number): void {}
  lateUpdate(deltaTime: number): void {}
  onEnable(): void {}
  onDisable(): void {}
  onDestroy(): void {}
  onCollisionEnter(other: GameObject): void {}
  onCollisionExit(other: GameObject): void {}
  onTriggerEnter(other: GameObject): void {}
  onTriggerExit(other: GameObject): void {}

  serialize(): ComponentData {
    return {
      type: this.type,
      enabled: this.enabled,
      properties: this.getProperties(),
    };
  }

  abstract getProperties(): Record<string, any>;
  abstract deserialize(data: ComponentData): void;
}

// ===== TRANSFORM =====
export class Transform extends RafeeqComponent {
  position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  rotation: THREE.Euler = new THREE.Euler(0, 0, 0);
  scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
  localPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  localRotation: THREE.Euler = new THREE.Euler(0, 0, 0);
  localScale: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
  parent: Transform | null = null;
  children: Transform[] = [];

  constructor() {
    super("Transform");
  }

  translate(translation: THREE.Vector3, space: "local" | "world" = "local"): void {
    if (space === "local") {
      this.position.add(translation);
    } else {
      this.position.add(translation);
    }
    this.syncToGameObject();
  }

  rotate(euler: THREE.Euler, space: "local" | "world" = "local"): void {
    if (space === "local") {
      this.rotation.x += euler.x;
      this.rotation.y += euler.y;
      this.rotation.z += euler.z;
    }
    this.syncToGameObject();
  }

  lookAt(target: THREE.Vector3, worldUp: THREE.Vector3 = new THREE.Vector3(0, 1, 0)): void {
    const direction = new THREE.Vector3().subVectors(target, this.position).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
    this.rotation.setFromQuaternion(quaternion);
    this.syncToGameObject();
  }

  private syncToGameObject(): void {
    if (this.gameObject?.transform) {
      this.gameObject.transform.position.copy(this.position);
      this.gameObject.transform.rotation.copy(this.rotation);
      this.gameObject.transform.scale.copy(this.scale);
    }
  }

  getProperties(): Record<string, any> {
    return {
      position: [this.position.x, this.position.y, this.position.z],
      rotation: [this.rotation.x, this.rotation.y, this.rotation.z],
      scale: [this.scale.x, this.scale.y, this.scale.z],
    };
  }

  deserialize(data: ComponentData): void {
    const p = data.properties.position;
    const r = data.properties.rotation;
    const s = data.properties.scale;
    if (p) this.position.set(p[0], p[1], p[2]);
    if (r) this.rotation.set(r[0], r[1], r[2]);
    if (s) this.scale.set(s[0], s[1], s[2]);
  }
}

// ===== MESH RENDERER =====
export class MeshRenderer extends RafeeqComponent {
  mesh: THREE.Mesh | null = null;
  material: THREE.Material = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
  castShadows: boolean = true;
  receiveShadows: boolean = true;
  isVisible: boolean = true;

  constructor() {
    super("MeshRenderer");
  }

  setMesh(geometry: THREE.BufferGeometry): void {
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.castShadow = this.castShadows;
    this.mesh.receiveShadow = this.receiveShadows;
    if (this.gameObject?.scene) {
      this.gameObject.scene.add(this.mesh);
    }
  }

  setMaterial(material: THREE.Material): void {
    this.material = material;
    if (this.mesh) {
      this.mesh.material = material;
    }
  }

  getProperties(): Record<string, any> {
    return {
      castShadows: this.castShadows,
      receiveShadows: this.receiveShadows,
      isVisible: this.isVisible,
    };
  }

  deserialize(data: ComponentData): void {
    this.castShadows = data.properties.castShadows ?? true;
    this.receiveShadows = data.properties.receiveShadows ?? true;
    this.isVisible = data.properties.isVisible ?? true;
  }
}

// ===== CAMERA =====
export class Camera extends RafeeqComponent {
  camera: THREE.PerspectiveCamera;
  fov: number = 75;
  near: number = 0.1;
  far: number = 1000;
  backgroundColor: THREE.Color = new THREE.Color(0x0a0a0f);
  clearFlags: "solidColor" | "skybox" | "depthOnly" = "solidColor";
  isMainCamera: boolean = false;

  constructor() {
    super("Camera");
    this.camera = new THREE.PerspectiveCamera(this.fov, 16 / 9, this.near, this.far);
  }

  setViewport(x: number, y: number, width: number, height: number): void {
    // Store viewport data for renderer
  }

  worldToScreenPoint(worldPos: THREE.Vector3): THREE.Vector2 {
    const projected = worldPos.clone().project(this.camera);
    return new THREE.Vector2(
      (projected.x + 1) / 2,
      (projected.y + 1) / 2
    );
  }

  screenToWorldPoint(screenPos: THREE.Vector2, depth: number = 10): THREE.Vector3 {
    const vector = new THREE.Vector3(
      screenPos.x * 2 - 1,
      -(screenPos.y * 2 - 1),
      0.5
    );
    vector.unproject(this.camera);
    const dir = vector.sub(this.camera.position).normalize();
    return this.camera.position.clone().add(dir.multiplyScalar(depth));
  }

  getProperties(): Record<string, any> {
    return {
      fov: this.fov,
      near: this.near,
      far: this.far,
      backgroundColor: this.backgroundColor.getHex(),
      clearFlags: this.clearFlags,
      isMainCamera: this.isMainCamera,
    };
  }

  deserialize(data: ComponentData): void {
    this.fov = data.properties.fov ?? 75;
    this.near = data.properties.near ?? 0.1;
    this.far = data.properties.far ?? 1000;
    this.isMainCamera = data.properties.isMainCamera ?? false;
  }
}

// ===== LIGHT =====
export class Light extends RafeeqComponent {
  light: THREE.Light;
  lightType: "directional" | "point" | "spot" | "ambient" | "area" = "directional";
  color: THREE.Color = new THREE.Color(0xffffff);
  intensity: number = 1;
  range: number = 10;
  shadowType: "none" | "hard" | "soft" = "soft";

  constructor(type: "directional" | "point" | "spot" | "ambient" = "directional") {
    super("Light");
    this.lightType = type;
    switch (type) {
      case "directional": this.light = new THREE.DirectionalLight(this.color, this.intensity); break;
      case "point": this.light = new THREE.PointLight(this.color, this.intensity, this.range); break;
      case "spot": this.light = new THREE.SpotLight(this.color, this.intensity); break;
      case "ambient": this.light = new THREE.AmbientLight(this.color, this.intensity); break;
      default: this.light = new THREE.DirectionalLight(this.color, this.intensity);
    }
  }

  getProperties(): Record<string, any> {
    return {
      lightType: this.lightType,
      color: this.color.getHex(),
      intensity: this.intensity,
      range: this.range,
      shadowType: this.shadowType,
    };
  }

  deserialize(data: ComponentData): void {
    this.lightType = data.properties.lightType ?? "directional";
    this.intensity = data.properties.intensity ?? 1;
    this.range = data.properties.range ?? 10;
    this.shadowType = data.properties.shadowType ?? "soft";
  }
}

// ===== RIGIDBODY =====
export class Rigidbody extends RafeeqComponent {
  mass: number = 1;
  drag: number = 0;
  angularDrag: number = 0.05;
  useGravity: boolean = true;
  isKinematic: boolean = false;
  interpolation: "none" | "interpolate" | "extrapolate" = "none";
  collisionDetection: "discrete" | "continuous" | "continuousDynamic" = "discrete";
  velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  angularVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  constructor() {
    super("Rigidbody");
  }

  addForce(force: THREE.Vector3, mode: "force" | "impulse" | "velocityChange" | "acceleration" = "force"): void {
    switch (mode) {
      case "force": this.velocity.add(force.divideScalar(this.mass)); break;
      case "impulse": this.velocity.add(force.divideScalar(this.mass)); break;
      case "velocityChange": this.velocity.add(force); break;
      case "acceleration": this.velocity.add(force); break;
    }
  }

  addTorque(torque: THREE.Vector3): void {
    this.angularVelocity.add(torque.divideScalar(this.mass));
  }

  movePosition(position: THREE.Vector3): void {
    if (this.gameObject) {
      this.gameObject.transform.position.copy(position);
    }
  }

  moveRotation(rotation: THREE.Quaternion): void {
    if (this.gameObject) {
      this.gameObject.transform.rotation.setFromQuaternion(rotation);
    }
  }

  getProperties(): Record<string, any> {
    return {
      mass: this.mass,
      drag: this.drag,
      angularDrag: this.angularDrag,
      useGravity: this.useGravity,
      isKinematic: this.isKinematic,
      velocity: [this.velocity.x, this.velocity.y, this.velocity.z],
    };
  }

  deserialize(data: ComponentData): void {
    this.mass = data.properties.mass ?? 1;
    this.drag = data.properties.drag ?? 0;
    this.angularDrag = data.properties.angularDrag ?? 0.05;
    this.useGravity = data.properties.useGravity ?? true;
    this.isKinematic = data.properties.isKinematic ?? false;
  }
}

// ===== COLLIDER =====
export class Collider extends RafeeqComponent {
  colliderType: "box" | "sphere" | "capsule" | "mesh" | "terrain" = "box";
  isTrigger: boolean = false;
  center: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  size: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
  radius: number = 0.5;
  height: number = 2;
  material: { dynamicFriction: number; staticFriction: number; bounciness: number } = {
    dynamicFriction: 0.3,
    staticFriction: 0.3,
    bounciness: 0.5,
  };

  constructor() {
    super("Collider");
  }

  getProperties(): Record<string, any> {
    return {
      colliderType: this.colliderType,
      isTrigger: this.isTrigger,
      center: [this.center.x, this.center.y, this.center.z],
      size: [this.size.x, this.size.y, this.size.z],
      radius: this.radius,
      height: this.height,
      material: this.material,
    };
  }

  deserialize(data: ComponentData): void {
    this.colliderType = data.properties.colliderType ?? "box";
    this.isTrigger = data.properties.isTrigger ?? false;
    this.radius = data.properties.radius ?? 0.5;
    this.height = data.properties.height ?? 2;
    this.material = data.properties.material ?? { dynamicFriction: 0.3, staticFriction: 0.3, bounciness: 0.5 };
  }
}

// ===== GAME OBJECT =====
export class GameObject {
  id: string;
  name: string;
  tag: string = "Untagged";
  layer: number = 0;
  isActive: boolean = true;
  isStatic: boolean = false;
  transform: Transform;
  components: RafeeqComponent[] = [];
  scene: THREE.Scene | null = null;
  threeObject: THREE.Object3D;

  constructor(name: string = "GameObject") {
    this.id = `go_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    this.name = name;
    this.threeObject = new THREE.Object3D();
    this.threeObject.userData = { gameObjectId: this.id };
    this.transform = new Transform();
    this.transform.gameObject = this;
    this.components.push(this.transform);
  }

  addComponent<T extends RafeeqComponent>(component: T): T {
    component.gameObject = this;
    this.components.push(component);
    component.awake();
    return component;
  }

  getComponent<T extends RafeeqComponent>(type: ComponentType): T | null {
    return this.components.find((c) => c.type === type) as T | null;
  }

  getComponents<T extends RafeeqComponent>(type: ComponentType): T[] {
    return this.components.filter((c) => c.type === type) as T[];
  }

  removeComponent(component: RafeeqComponent): void {
    const index = this.components.indexOf(component);
    if (index > -1) {
      component.onDestroy();
      this.components.splice(index, 1);
    }
  }

  sendMessage(methodName: string, ...args: any[]): void {
    this.components.forEach((comp) => {
      if (comp.enabled && typeof (comp as any)[methodName] === "function") {
        (comp as any)[methodName](...args);
      }
    });
  }

  destroy(): void {
    this.components.forEach((c) => c.onDestroy());
    this.components = [];
    if (this.scene) {
      this.scene.remove(this.threeObject);
    }
  }

  serialize(): object {
    return {
      id: this.id,
      name: this.name,
      tag: this.tag,
      layer: this.layer,
      isActive: this.isActive,
      isStatic: this.isStatic,
      transform: this.transform.serialize(),
      components: this.components.filter((c) => c.type !== "Transform").map((c) => c.serialize()),
    };
  }
}
