"""Rafeeq Game Engine — Simple Physics System"""
import * as THREE from "three";

export interface RigidBody {
  id: string;
  object: THREE.Object3D;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  mass: number;
  isStatic: boolean;
  gravity: boolean;
  friction: number;
  restitution: number;
  bounds: THREE.Box3;
}

export class PhysicsWorld {
  bodies: Map<string, RigidBody> = new Map();
  gravity: THREE.Vector3 = new THREE.Vector3(0, -9.81, 0);
  isRunning: boolean = false;

  addBody(id: string, object: THREE.Object3D, config: Partial<RigidBody> = {}): RigidBody {
    const body: RigidBody = {
      id,
      object,
      velocity: new THREE.Vector3(0, 0, 0),
      angularVelocity: new THREE.Vector3(0, 0, 0),
      mass: config.mass ?? 1,
      isStatic: config.isStatic ?? false,
      gravity: config.gravity ?? true,
      friction: config.friction ?? 0.3,
      restitution: config.restitution ?? 0.5,
      bounds: new THREE.Box3().setFromObject(object),
    };
    this.bodies.set(id, body);
    return body;
  }

  removeBody(id: string): void {
    this.bodies.delete(id);
  }

  step(delta: number): void {
    this.bodies.forEach((body) => {
      if (body.isStatic) return;

      // Apply gravity
      if (body.gravity) {
        body.velocity.add(this.gravity.clone().multiplyScalar(delta));
      }

      // Apply friction
      body.velocity.multiplyScalar(1 - body.friction * delta);

      // Update position
      const deltaPos = body.velocity.clone().multiplyScalar(delta);
      body.object.position.add(deltaPos);

      // Update rotation
      body.object.rotation.x += body.angularVelocity.x * delta;
      body.object.rotation.y += body.angularVelocity.y * delta;
      body.object.rotation.z += body.angularVelocity.z * delta;

      // Update bounds
      body.bounds.setFromObject(body.object);

      // Simple ground collision
      if (body.object.position.y < 0.5) {
        body.object.position.y = 0.5;
        body.velocity.y *= -body.restitution;
        if (Math.abs(body.velocity.y) < 0.1) body.velocity.y = 0;
      }
    });

    // Simple AABB collision detection
    this.checkCollisions();
  }

  private checkCollisions(): void {
    const bodies = Array.from(this.bodies.values()).filter((b) => !b.isStatic);
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        if (bodies[i].bounds.intersectsBox(bodies[j].bounds)) {
          // Simple elastic collision response
          const normal = new THREE.Vector3()
            .subVectors(bodies[j].object.position, bodies[i].object.position)
            .normalize();
          const relativeVelocity = new THREE.Vector3().subVectors(
            bodies[j].velocity,
            bodies[i].velocity
          );
          const speed = relativeVelocity.dot(normal);
          if (speed > 0) continue;

          const impulse =
            (-(1 + Math.min(bodies[i].restitution, bodies[j].restitution)) * speed) /
            (1 / bodies[i].mass + 1 / bodies[j].mass);

          const impulseVector = normal.multiplyScalar(impulse);
          bodies[i].velocity.sub(impulseVector.clone().multiplyScalar(1 / bodies[i].mass));
          bodies[j].velocity.add(impulseVector.clone().multiplyScalar(1 / bodies[j].mass));
        }
      }
    }
  }

  applyForce(id: string, force: THREE.Vector3): void {
    const body = this.bodies.get(id);
    if (body && !body.isStatic) {
      body.velocity.add(force.clone().divideScalar(body.mass));
    }
  }

  applyImpulse(id: string, impulse: THREE.Vector3): void {
    const body = this.bodies.get(id);
    if (body && !body.isStatic) {
      body.velocity.add(impulse.clone().divideScalar(body.mass));
    }
  }
}
