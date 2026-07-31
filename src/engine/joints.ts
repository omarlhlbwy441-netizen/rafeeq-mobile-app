"""Rafeeq Game Engine — Physics Joints (Unity Joint architecture)"""
import * as THREE from "three";

export interface Joint {
  id: string;
  type: "fixed" | "hinge" | "spring" | "distance" | "configurable";
  bodyA: string;
  bodyB: string;
  anchor: THREE.Vector3;
  connectedAnchor: THREE.Vector3;
  breakForce: number;
  breakTorque: number;
  enableCollision: boolean;
  enabled: boolean;
}

export class FixedJoint implements Joint {
  id: string;
  type: "fixed" = "fixed";
  bodyA: string;
  bodyB: string;
  anchor: THREE.Vector3;
  connectedAnchor: THREE.Vector3;
  breakForce: number = Infinity;
  breakTorque: number = Infinity;
  enableCollision: boolean = false;
  enabled: boolean = true;

  constructor(bodyA: string, bodyB: string) {
    this.id = `joint_${Date.now()}`;
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.anchor = new THREE.Vector3();
    this.connectedAnchor = new THREE.Vector3();
  }
}

export class HingeJoint implements Joint {
  id: string;
  type: "hinge" = "hinge";
  bodyA: string;
  bodyB: string;
  anchor: THREE.Vector3;
  connectedAnchor: THREE.Vector3;
  axis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  useLimits: boolean = false;
  limits: { min: number; max: number; bounciness: number; bounceMinVelocity: number } = {
    min: -180,
    max: 180,
    bounciness: 0,
    bounceMinVelocity: 0.2,
  };
  useMotor: boolean = false;
  motor: { targetVelocity: number; force: number; freeSpin: boolean } = {
    targetVelocity: 0,
    force: 0,
    freeSpin: false,
  };
  useSpring: boolean = false;
  spring: { spring: number; damper: number; targetPosition: number } = {
    spring: 0,
    damper: 0,
    targetPosition: 0,
  };
  breakForce: number = Infinity;
  breakTorque: number = Infinity;
  enableCollision: boolean = false;
  enabled: boolean = true;

  constructor(bodyA: string, bodyB: string) {
    this.id = `hinge_${Date.now()}`;
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.anchor = new THREE.Vector3();
    this.connectedAnchor = new THREE.Vector3();
  }
}

export class SpringJoint implements Joint {
  id: string;
  type: "spring" = "spring";
  bodyA: string;
  bodyB: string;
  anchor: THREE.Vector3;
  connectedAnchor: THREE.Vector3;
  spring: number = 10;
  damper: number = 0.2;
  minDistance: number = 0;
  maxDistance: number = 0;
  tolerance: number = 0.025;
  breakForce: number = Infinity;
  breakTorque: number = Infinity;
  enableCollision: boolean = false;
  enabled: boolean = true;

  constructor(bodyA: string, bodyB: string) {
    this.id = `spring_${Date.now()}`;
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.anchor = new THREE.Vector3();
    this.connectedAnchor = new THREE.Vector3();
  }
}

export class DistanceJoint implements Joint {
  id: string;
  type: "distance" = "distance";
  bodyA: string;
  bodyB: string;
  anchor: THREE.Vector3;
  connectedAnchor: THREE.Vector3;
  minDistance: number = 0;
  maxDistance: number = 0;
  tolerance: number = 0.025;
  breakForce: number = Infinity;
  breakTorque: number = Infinity;
  enableCollision: boolean = false;
  enabled: boolean = true;

  constructor(bodyA: string, bodyB: string) {
    this.id = `distance_${Date.now()}`;
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.anchor = new THREE.Vector3();
    this.connectedAnchor = new THREE.Vector3();
  }
}

export class JointSystem {
  private joints: Map<string, Joint> = new Map();

  addJoint(joint: Joint): void {
    this.joints.set(joint.id, joint);
  }

  removeJoint(id: string): void {
    this.joints.delete(id);
  }

  getJoint(id: string): Joint | undefined {
    return this.joints.get(id);
  }

  getJointsForBody(bodyId: string): Joint[] {
    return Array.from(this.joints.values()).filter(
      (j) => j.bodyA === bodyId || j.bodyB === bodyId
    );
  }

  update(deltaTime: number): void {
    // Apply joint constraints
    this.joints.forEach((joint) => {
      if (!joint.enabled) return;
      // Simplified constraint solving
    });
  }

  breakJoint(id: string): void {
    const joint = this.joints.get(id);
    if (joint) {
      joint.enabled = false;
    }
  }

  list(): Joint[] {
    return Array.from(this.joints.values());
  }
}
