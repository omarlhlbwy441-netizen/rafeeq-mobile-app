"""Rafeeq Game Engine — Advanced Particle System (Unity VFX Graph + Shuriken architecture)"""
import * as THREE from "three";

export interface ParticleModule {
  enabled: boolean;
}

export interface EmissionModule extends ParticleModule {
  rateOverTime: number;
  rateOverDistance: number;
  bursts: Array<{ time: number; count: number; cycles: number; interval: number; probability: number }>;
}

export interface ShapeModule extends ParticleModule {
  shapeType: "sphere" | "hemisphere" | "cone" | "box" | "circle" | "edge" | "mesh";
  radius: number;
  angle: number;
  length: number;
  box: [number, number, number];
  mesh: THREE.BufferGeometry | null;
  emitFrom: "base" | "volume" | "shell" | "edge";
  alignToDirection: boolean;
  randomizeDirection: boolean;
  sphericalDirectionAmount: number;
  randomPositionAmount: number;
}

export interface VelocityOverLifetimeModule extends ParticleModule {
  x: { type: "constant" | "curve" | "randomBetweenTwoConstants"; value: number; min: number; max: number };
  y: { type: "constant" | "curve" | "randomBetweenTwoConstants"; value: number; min: number; max: number };
  z: { type: "constant" | "curve" | "randomBetweenTwoConstants"; value: number; min: number; max: number };
  space: "local" | "world";
}

export interface ColorOverLifetimeModule extends ParticleModule {
  gradient: Array<{ time: number; color: [number, number, number, number] }>;
}

export interface SizeOverLifetimeModule extends ParticleModule {
  x: { type: "constant" | "curve"; value: number; curve: number[] };
  y: { type: "constant" | "curve"; value: number; curve: number[] };
  z: { type: "constant" | "curve"; value: number; curve: number[] };
  separateAxes: boolean;
}

export interface RotationOverLifetimeModule extends ParticleModule {
  x: { type: "constant" | "curve"; value: number };
  y: { type: "constant" | "curve"; value: number };
  z: { type: "constant" | "curve"; value: number };
}

export interface ForceOverLifetimeModule extends ParticleModule {
  x: { type: "constant" | "curve"; value: number };
  y: { type: "constant" | "curve"; value: number };
  z: { type: "constant" | "curve"; value: number };
  space: "local" | "world";
  randomized: number;
}

export interface CollisionModule extends ParticleModule {
  type: "planes" | "world" | "visualization";
  dampen: number;
  bounce: number;
  lifetimeLoss: number;
  minKillSpeed: number;
  maxKillSpeed: number;
  radiusScale: number;
  collidesWith: number;
  enableDynamicColliders: boolean;
  maxCollisionShapes: number;
  quality: "high" | "medium" | "low";
  voxelSize: number;
  collisionMessages: boolean;
}

export interface TrailModule extends ParticleModule {
  enabled: boolean;
  ratio: number;
  lifetime: { type: "constant" | "curve"; value: number };
  minVertexDistance: number;
  textureMode: "stretch" | "tile";
  worldSpace: boolean;
  dieWithParticles: boolean;
  sizeAffectsWidth: boolean;
  sizeAffectsLifetime: boolean;
  inheritParticleColor: boolean;
  colorOverTrail: Array<{ time: number; color: [number, number, number, number] }>;
  widthOverTrail: { type: "constant" | "curve"; value: number };
}

export interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
  rotation: THREE.Euler;
  age: number;
  lifetime: number;
  startLifetime: number;
  startSize: number;
  startColor: THREE.Color;
  startRotation: THREE.Euler;
  alive: boolean;
}

export class RafeeqParticleSystem {
  id: string;
  name: string;
  maxParticles: number = 1000;
  duration: number = 5;
  loop: boolean = true;
  prewarm: boolean = false;
  startDelay: number = 0;
  startLifetime: { type: "constant" | "randomBetweenTwoConstants"; value: number; min: number; max: number } = {
    type: "constant", value: 5, min: 1, max: 10,
  };
  startSpeed: { type: "constant" | "randomBetweenTwoConstants"; value: number; min: number; max: number } = {
    type: "constant", value: 5, min: 0, max: 10,
  };
  startSize: { type: "constant" | "randomBetweenTwoConstants"; value: number; min: number; max: number; separateAxes: boolean } = {
    type: "constant", value: 1, min: 0.1, max: 2, separateAxes: false,
  };
  startRotation: { type: "constant" | "randomBetweenTwoConstants"; value: number; min: number; max: number; separateAxes: boolean } = {
    type: "constant", value: 0, min: 0, max: 360, separateAxes: false,
  };
  startColor: { type: "constant" | "gradient" | "randomBetweenTwoColors"; value: THREE.Color; min: THREE.Color; max: THREE.Color; gradient: Array<{ time: number; color: [number, number, number, number] }> } = {
    type: "constant", value: new THREE.Color(1, 1, 1), min: new THREE.Color(0, 0, 0), max: new THREE.Color(1, 1, 1), gradient: [],
  };
  gravityModifier: number = 0;
  simulationSpace: "local" | "world" = "local";
  simulationSpeed: number = 1;
  scalingMode: "local" | "shape" | "hierarchy" = "local";
  playOnAwake: boolean = true;
  emitterVelocityMode: "transform" | "rigidbody" = "transform";
  maxParticleSize: number = 10;

  // Modules
  emission: EmissionModule = {
    enabled: true, rateOverTime: 10, rateOverDistance: 0, bursts: [],
  };
  shape: ShapeModule = {
    enabled: true, shapeType: "cone", radius: 1, angle: 25, length: 5,
    box: [1, 1, 1], mesh: null, emitFrom: "base", alignToDirection: false,
    randomizeDirection: 0, sphericalDirectionAmount: 0, randomPositionAmount: 0,
  };
  velocityOverLifetime: VelocityOverLifetimeModule = {
    enabled: false,
    x: { type: "constant", value: 0, min: 0, max: 0 },
    y: { type: "constant", value: 0, min: 0, max: 0 },
    z: { type: "constant", value: 0, min: 0, max: 0 },
    space: "local",
  };
  colorOverLifetime: ColorOverLifetimeModule = {
    enabled: false,
    gradient: [
      { time: 0, color: [1, 1, 1, 1] },
      { time: 1, color: [1, 1, 1, 0] },
    ],
  };
  sizeOverLifetime: SizeOverLifetimeModule = {
    enabled: false,
    x: { type: "curve", value: 1, curve: [1, 0] },
    y: { type: "curve", value: 1, curve: [1, 0] },
    z: { type: "curve", value: 1, curve: [1, 0] },
    separateAxes: false,
  };
  rotationOverLifetime: RotationOverLifetimeModule = {
    enabled: false,
    x: { type: "constant", value: 0 },
    y: { type: "constant", value: 0 },
    z: { type: "constant", value: 0 },
  };
  forceOverLifetime: ForceOverLifetimeModule = {
    enabled: false,
    x: { type: "constant", value: 0 },
    y: { type: "constant", value: 0 },
    z: { type: "constant", value: 0 },
    space: "local", randomized: 0,
  };
  collision: CollisionModule = {
    enabled: false, type: "planes", dampen: 0, bounce: 1,
    lifetimeLoss: 0, minKillSpeed: 0, maxKillSpeed: 0,
    radiusScale: 1, collidesWith: 0xFFFFFFFF, enableDynamicColliders: false,
    maxCollisionShapes: 256, quality: "medium", voxelSize: 0.5, collisionMessages: false,
  };
  trails: TrailModule = {
    enabled: false, ratio: 1, lifetime: { type: "constant", value: 1 },
    minVertexDistance: 0.1, textureMode: "stretch", worldSpace: false,
    dieWithParticles: true, sizeAffectsWidth: true, sizeAffectsLifetime: false,
    inheritParticleColor: true, colorOverTrail: [], widthOverTrail: { type: "constant", value: 1 },
  };

  // Internal
  particles: ParticleData[] = [];
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial | THREE.ShaderMaterial;
  private mesh: THREE.Points | THREE.Mesh;
  private elapsedTime: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private emissionAccumulated: number = 0;
  private burstTimes: Map<number, boolean> = new Map();

  constructor(name: string = "Particle System") {
    this.id = `ps_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    this.name = name;

    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
  }

  play(): void {
    this.isPlaying = true;
    this.isPaused = false;
    if (this.prewarm) {
      this.simulate(this.duration, true);
    }
  }

  pause(): void {
    this.isPaused = true;
  }

  stop(withChildren: boolean = true): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.particles = [];
    this.updateGeometry();
  }

  clear(): void {
    this.particles = [];
    this.updateGeometry();
  }

  simulate(t: number, restart: boolean = false): void {
    if (restart) {
      this.particles = [];
      this.elapsedTime = 0;
    }
    const steps = Math.ceil(t / 0.016);
    for (let i = 0; i < steps; i++) {
      this.update(0.016);
    }
  }

  isAlive(): boolean {
    return this.isPlaying && (this.loop || this.elapsedTime < this.duration || this.particles.some((p) => p.alive));
  }

  update(deltaTime: number): void {
    if (!this.isPlaying || this.isPaused) return;

    const dt = deltaTime * this.simulationSpeed;
    this.elapsedTime += dt;

    // Emission
    if (this.emission.enabled) {
      this.emissionAccumulated += this.emission.rateOverTime * dt;
      const toEmit = Math.floor(this.emissionAccumulated);
      this.emissionAccumulated -= toEmit;
      for (let i = 0; i < toEmit && this.particles.length < this.maxParticles; i++) {
        this.emitParticle();
      }

      // Bursts
      this.emission.bursts.forEach((burst) => {
        if (this.elapsedTime >= burst.time && !this.burstTimes.has(burst.time)) {
          this.burstTimes.set(burst.time, true);
          for (let i = 0; i < burst.count && this.particles.length < this.maxParticles; i++) {
            this.emitParticle();
          }
        }
      });
    }

    // Update particles
    this.particles.forEach((p) => {
      if (!p.alive) return;

      p.age += dt;
      const normalizedAge = p.age / p.lifetime;

      if (p.age >= p.lifetime) {
        p.alive = false;
        return;
      }

      // Apply modules
      this.applyVelocityOverLifetime(p, dt);
      this.applyForceOverLifetime(p, dt);
      this.applyColorOverLifetime(p, normalizedAge);
      this.applySizeOverLifetime(p, normalizedAge);
      this.applyRotationOverLifetime(p, dt);

      // Gravity
      p.velocity.y -= 9.81 * this.gravityModifier * dt;

      // Update position
      p.position.add(p.velocity.clone().multiplyScalar(dt));
    });

    // Remove dead particles
    this.particles = this.particles.filter((p) => p.alive);

    // Loop
    if (!this.loop && this.elapsedTime >= this.duration && this.particles.length === 0) {
      this.isPlaying = false;
    }

    this.updateGeometry();
  }

  private emitParticle(): void {
    const lifetime = this.getStartLifetime();
    const speed = this.getStartSpeed();
    const size = this.getStartSize();
    const color = this.getStartColor();
    const rotation = this.getStartRotation();

    const direction = this.getEmitDirection();
    const velocity = direction.multiplyScalar(speed);

    const particle: ParticleData = {
      position: this.getEmitPosition(),
      velocity,
      color: color.clone(),
      size,
      rotation: rotation.clone(),
      age: 0,
      lifetime,
      startLifetime: lifetime,
      startSize: size,
      startColor: color.clone(),
      startRotation: rotation.clone(),
      alive: true,
    };

    this.particles.push(particle);
  }

  private getEmitPosition(): THREE.Vector3 {
    const shape = this.shape;
    switch (shape.shapeType) {
      case "sphere":
        return new THREE.Vector3(
          (Math.random() - 0.5) * 2 * shape.radius,
          (Math.random() - 0.5) * 2 * shape.radius,
          (Math.random() - 0.5) * 2 * shape.radius
        );
      case "cone": {
        const r = Math.random() * shape.radius;
        const theta = Math.random() * Math.PI * 2;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        return new THREE.Vector3(x, 0, z);
      }
      case "box":
        return new THREE.Vector3(
          (Math.random() - 0.5) * shape.box[0],
          (Math.random() - 0.5) * shape.box[1],
          (Math.random() - 0.5) * shape.box[2]
        );
      default:
        return new THREE.Vector3();
    }
  }

  private getEmitDirection(): THREE.Vector3 {
    const shape = this.shape;
    switch (shape.shapeType) {
      case "cone": {
        const angleRad = (shape.angle * Math.PI) / 180;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * angleRad;
        return new THREE.Vector3(
          Math.sin(theta) * Math.cos(phi),
          Math.cos(theta),
          Math.sin(theta) * Math.sin(phi)
        ).normalize();
      }
      case "sphere":
        return new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
      default:
        return new THREE.Vector3(0, 1, 0);
    }
  }

  private getStartLifetime(): number {
    if (this.startLifetime.type === "randomBetweenTwoConstants") {
      return this.startLifetime.min + Math.random() * (this.startLifetime.max - this.startLifetime.min);
    }
    return this.startLifetime.value;
  }

  private getStartSpeed(): number {
    if (this.startSpeed.type === "randomBetweenTwoConstants") {
      return this.startSpeed.min + Math.random() * (this.startSpeed.max - this.startSpeed.min);
    }
    return this.startSpeed.value;
  }

  private getStartSize(): number {
    if (this.startSize.type === "randomBetweenTwoConstants") {
      return this.startSize.min + Math.random() * (this.startSize.max - this.startSize.min);
    }
    return this.startSize.value;
  }

  private getStartColor(): THREE.Color {
    if (this.startColor.type === "randomBetweenTwoColors") {
      return new THREE.Color().lerpColors(this.startColor.min, this.startColor.max, Math.random());
    }
    return this.startColor.value.clone();
  }

  private getStartRotation(): THREE.Euler {
    if (this.startRotation.type === "randomBetweenTwoConstants") {
      const v = this.startRotation.min + Math.random() * (this.startRotation.max - this.startRotation.min);
      return new THREE.Euler(v, v, v);
    }
    return new THREE.Euler(this.startRotation.value, this.startRotation.value, this.startRotation.value);
  }

  private applyVelocityOverLifetime(p: ParticleData, dt: number): void {
    if (!this.velocityOverLifetime.enabled) return;
    const v = this.velocityOverLifetime;
    p.velocity.x += this.getModuleValue(v.x) * dt;
    p.velocity.y += this.getModuleValue(v.y) * dt;
    p.velocity.z += this.getModuleValue(v.z) * dt;
  }

  private applyForceOverLifetime(p: ParticleData, dt: number): void {
    if (!this.forceOverLifetime.enabled) return;
    const f = this.forceOverLifetime;
    p.velocity.x += this.getModuleValue(f.x) * dt;
    p.velocity.y += this.getModuleValue(f.y) * dt;
    p.velocity.z += this.getModuleValue(f.z) * dt;
  }

  private applyColorOverLifetime(p: ParticleData, t: number): void {
    if (!this.colorOverLifetime.enabled || this.colorOverLifetime.gradient.length === 0) return;
    const g = this.colorOverLifetime.gradient;
    let c1 = g[0];
    let c2 = g[g.length - 1];
    for (let i = 0; i < g.length - 1; i++) {
      if (t >= g[i].time && t <= g[i + 1].time) {
        c1 = g[i];
        c2 = g[i + 1];
        break;
      }
    }
    const lt = c2.time - c1.time > 0 ? (t - c1.time) / (c2.time - c1.time) : 0;
    p.color.r = c1.color[0] + (c2.color[0] - c1.color[0]) * lt;
    p.color.g = c1.color[1] + (c2.color[1] - c1.color[1]) * lt;
    p.color.b = c1.color[2] + (c2.color[2] - c1.color[2]) * lt;
    p.color.a = c1.color[3] + (c2.color[3] - c1.color[3]) * lt;
  }

  private applySizeOverLifetime(p: ParticleData, t: number): void {
    if (!this.sizeOverLifetime.enabled) return;
    const s = this.sizeOverLifetime;
    const curve = s.x.curve;
    const idx = Math.min(Math.floor(t * (curve.length - 1)), curve.length - 2);
    const lt = t * (curve.length - 1) - idx;
    const val = curve[idx] + (curve[idx + 1] - curve[idx]) * lt;
    p.size = p.startSize * val;
  }

  private applyRotationOverLifetime(p: ParticleData, dt: number): void {
    if (!this.rotationOverLifetime.enabled) return;
    const r = this.rotationOverLifetime;
    p.rotation.x += this.getModuleValue(r.x) * dt;
    p.rotation.y += this.getModuleValue(r.y) * dt;
    p.rotation.z += this.getModuleValue(r.z) * dt;
  }

  private getModuleValue(v: { type: string; value: number }): number {
    if (v.type === "randomBetweenTwoConstants") {
      return v.value; // Simplified
    }
    return v.value;
  }

  private updateGeometry(): void {
    const count = this.particles.length;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 4);
    const sizes = new Float32Array(count);

    this.particles.forEach((p, i) => {
      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
      colors[i * 4] = p.color.r;
      colors[i * 4 + 1] = p.color.g;
      colors[i * 4 + 2] = p.color.b;
      colors[i * 4 + 3] = p.color.a;
      sizes[i] = p.size;
    });

    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));
    this.geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }

  getMesh(): THREE.Points {
    return this.mesh;
  }

  getParticleCount(): number {
    return this.particles.length;
  }

  serialize(): object {
    return {
      id: this.id,
      name: this.name,
      maxParticles: this.maxParticles,
      duration: this.duration,
      loop: this.loop,
      startLifetime: this.startLifetime,
      startSpeed: this.startSpeed,
      startSize: this.startSize,
      startColor: { type: this.startColor.type, value: this.startColor.value.getHex() },
      emission: this.emission,
      shape: { ...this.shape, mesh: null },
    };
  }
}
