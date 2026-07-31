"""Rafeeq Game Engine — Scripting System (Unity MonoBehaviour architecture)"""
import * as THREE from "three";
import { RafeeqComponent, GameObject, ComponentType } from "./component";

export abstract class MonoBehaviour extends RafeeqComponent {
  private _started: boolean = false;
  private _coroutines: Map<string, Generator> = new Map();

  constructor() {
    super("Script");
  }

  // Unity-like lifecycle (already in base, but we override here)
  override start(): void {
    if (!this._started) {
      this._started = true;
      this.Start();
    }
  }

  override update(deltaTime: number): void {
    this.Update(deltaTime);
    this.updateCoroutines();
  }

  override fixedUpdate(fixedDeltaTime: number): void {
    this.FixedUpdate(fixedDeltaTime);
  }

  override lateUpdate(deltaTime: number): void {
    this.LateUpdate(deltaTime);
  }

  override onEnable(): void {
    this.OnEnable();
  }

  override onDisable(): void {
    this.OnDisable();
  }

  override onDestroy(): void {
    this.OnDestroy();
    this._coroutines.clear();
  }

  // Unity-like methods (PascalCase like C#)
  protected Start(): void {}
  protected Update(deltaTime: number): void {}
  protected FixedUpdate(fixedDeltaTime: number): void {}
  protected LateUpdate(deltaTime: number): void {}
  protected OnEnable(): void {}
  protected OnDisable(): void {}
  protected OnDestroy(): void {}
  protected OnCollisionEnter(other: GameObject): void {}
  protected OnCollisionExit(other: GameObject): void {}
  protected OnTriggerEnter(other: GameObject): void {}
  protected OnTriggerExit(other: GameObject): void {}
  protected OnMouseDown(): void {}
  protected OnMouseUp(): void {}
  protected OnMouseDrag(): void {}

  // Coroutine system
  startCoroutine(name: string, generator: Generator): void {
    this._coroutines.set(name, generator);
  }

  stopCoroutine(name: string): void {
    this._coroutines.delete(name);
  }

  stopAllCoroutines(): void {
    this._coroutines.clear();
  }

  private updateCoroutines(): void {
    for (const [name, gen] of this._coroutines) {
      const result = gen.next();
      if (result.done) {
        this._coroutines.delete(name);
      }
    }
  }

  // Utility methods
  protected getComponent<T extends RafeeqComponent>(type: ComponentType): T | null {
    return this.gameObject?.getComponent(type) ?? null;
  }

  protected getComponents<T extends RafeeqComponent>(type: ComponentType): T[] {
    return this.gameObject?.getComponents(type) ?? [];
  }

  protected getComponentInChildren<T extends RafeeqComponent>(type: ComponentType): T | null {
    // Simplified - would need hierarchy traversal
    return this.getComponent(type);
  }

  protected getComponentInParent<T extends RafeeqComponent>(type: ComponentType): T | null {
    return this.getComponent(type);
  }

  protected instantiate(original: GameObject, position?: THREE.Vector3, rotation?: THREE.Euler): GameObject {
    // Simplified clone
    const clone = new GameObject(original.name + " (Clone)");
    if (position) clone.transform.position.copy(position);
    if (rotation) clone.transform.rotation.copy(rotation);
    return clone;
  }

  protected destroy(obj: GameObject | RafeeqComponent, delay: number = 0): void {
    if (delay > 0) {
      setTimeout(() => {
        if (obj instanceof GameObject) obj.destroy();
        else if (obj.gameObject) obj.gameObject.removeComponent(obj);
      }, delay * 1000);
    } else {
      if (obj instanceof GameObject) obj.destroy();
      else if (obj.gameObject) obj.gameObject.removeComponent(obj);
    }
  }

  protected print(message: string): void {
    console.log(`[${this.gameObject?.name}] ${message}`);
  }

  protected log(message: string): void {
    console.log(`[LOG] ${this.gameObject?.name}: ${message}`);
  }

  protected logWarning(message: string): void {
    console.warn(`[WARN] ${this.gameObject?.name}: ${message}`);
  }

  protected logError(message: string): void {
    console.error(`[ERROR] ${this.gameObject?.name}: ${message}`);
  }

  // Time utilities
  protected get deltaTime(): number {
    return 1 / 60; // Would be provided by engine
  }

  protected get fixedDeltaTime(): number {
    return 1 / 50;
  }

  protected get time(): number {
    return Date.now() / 1000;
  }

  getProperties(): Record<string, any> {
    return {};
  }

  deserialize(data: any): void {}
}

// ===== EXAMPLE SCRIPTS =====

export class Rotator extends MonoBehaviour {
  speed: number = 50;
  axis: "x" | "y" | "z" = "y";

  protected Update(deltaTime: number): void {
    const rotation = this.speed * deltaTime * (Math.PI / 180);
    if (this.axis === "x") {
      this.gameObject?.transform.rotation.x += rotation;
    } else if (this.axis === "y") {
      this.gameObject?.transform.rotation.y += rotation;
    } else {
      this.gameObject?.transform.rotation.z += rotation;
    }
  }

  getProperties(): Record<string, any> {
    return { speed: this.speed, axis: this.axis };
  }
}

export class Mover extends MonoBehaviour {
  speed: number = 5;
  direction: THREE.Vector3 = new THREE.Vector3(0, 0, 1);

  protected Update(deltaTime: number): void {
    const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
    this.gameObject?.transform.position.add(movement);
  }

  getProperties(): Record<string, any> {
    return { speed: this.speed, direction: [this.direction.x, this.direction.y, this.direction.z] };
  }
}

export class Oscillator extends MonoBehaviour {
  amplitude: number = 2;
  frequency: number = 1;
  axis: "x" | "y" | "z" = "y";
  private _startPos: THREE.Vector3 = new THREE.Vector3();

  protected Start(): void {
    if (this.gameObject) {
      this._startPos.copy(this.gameObject.transform.position);
    }
  }

  protected Update(deltaTime: number): void {
    if (!this.gameObject) return;
    const t = this.time * this.frequency;
    const offset = Math.sin(t * Math.PI * 2) * this.amplitude;
    const pos = this._startPos.clone();
    if (this.axis === "x") pos.x += offset;
    else if (this.axis === "y") pos.y += offset;
    else pos.z += offset;
    this.gameObject.transform.position.copy(pos);
  }

  getProperties(): Record<string, any> {
    return { amplitude: this.amplitude, frequency: this.frequency, axis: this.axis };
  }
}

export class LookAtCamera extends MonoBehaviour {
  protected LateUpdate(deltaTime: number): void {
    // Would look at main camera
  }
}

export class Billboard extends MonoBehaviour {
  protected LateUpdate(deltaTime: number): void {
    // Face camera always
  }
}
