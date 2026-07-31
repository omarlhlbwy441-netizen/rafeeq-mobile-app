"""Rafeeq Game Engine — AI Navigation System (Unity NavMesh architecture)"""
import * as THREE from "three";

export interface NavMeshAgent {
  id: string;
  position: THREE.Vector3;
  destination: THREE.Vector3 | null;
  velocity: THREE.Vector3;
  speed: number;
  angularSpeed: number;
  acceleration: number;
  stoppingDistance: number;
  radius: number;
  height: number;
  obstacleAvoidanceType: "none" | "lowQuality" | "medQuality" | "goodQuality" | "highQuality";
  path: THREE.Vector3[];
  pathIndex: number;
  isStopped: boolean;
  isOnNavMesh: boolean;
}

export class NavMeshSurface {
  vertices: THREE.Vector3[] = [];
  triangles: number[] = [];
  bounds: THREE.Box3 = new THREE.Box3();
  walkableMask: number = 0xFFFFFFFF;

  constructor(vertices: THREE.Vector3[], triangles: number[]) {
    this.vertices = vertices;
    this.triangles = triangles;
    this.calculateBounds();
  }

  private calculateBounds(): void {
    this.bounds.makeEmpty();
    this.vertices.forEach((v) => this.bounds.expandByPoint(v));
  }

  isPointOnNavMesh(point: THREE.Vector3): boolean {
    if (!this.bounds.containsPoint(point)) return false;
    // Raycast down to find if point is above a triangle
    return this.findClosestPointOnMesh(point) !== null;
  }

  findClosestPointOnMesh(point: THREE.Vector3): THREE.Vector3 | null {
    let closest: THREE.Vector3 | null = null;
    let minDist = Infinity;

    for (let i = 0; i < this.triangles.length; i += 3) {
      const v0 = this.vertices[this.triangles[i]];
      const v1 = this.vertices[this.triangles[i + 1]];
      const v2 = this.vertices[this.triangles[i + 2]];
      const closestPoint = this.closestPointOnTriangle(point, v0, v1, v2);
      const dist = point.distanceToSquared(closestPoint);
      if (dist < minDist) {
        minDist = dist;
        closest = closestPoint;
      }
    }

    return closest;
  }

  private closestPointOnTriangle(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): THREE.Vector3 {
    // Simplified - project to triangle plane
    const ab = new THREE.Vector3().subVectors(b, a);
    const ac = new THREE.Vector3().subVectors(c, a);
    const ap = new THREE.Vector3().subVectors(p, a);
    const normal = new THREE.Vector3().crossVectors(ab, ac).normalize();
    const dist = ap.dot(normal);
    return p.clone().sub(normal.multiplyScalar(dist));
  }
}

export class NavMeshPath {
  corners: THREE.Vector3[] = [];
  status: "complete" | "partial" | "invalid" = "invalid";
  length: number = 0;

  constructor(corners: THREE.Vector3[] = []) {
    this.corners = corners;
    this.status = corners.length > 0 ? "complete" : "invalid";
    this.calculateLength();
  }

  private calculateLength(): void {
    this.length = 0;
    for (let i = 1; i < this.corners.length; i++) {
      this.length += this.corners[i].distanceTo(this.corners[i - 1]);
    }
  }
}

export class NavMeshAgentController {
  private agents: Map<string, NavMeshAgent> = new Map();
  private surface: NavMeshSurface | null = null;

  setSurface(surface: NavMeshSurface): void {
    this.surface = surface;
  }

  createAgent(id: string, position: THREE.Vector3, config: Partial<NavMeshAgent> = {}): NavMeshAgent {
    const agent: NavMeshAgent = {
      id,
      position: position.clone(),
      destination: null,
      velocity: new THREE.Vector3(),
      speed: config.speed ?? 3.5,
      angularSpeed: config.angularSpeed ?? 120,
      acceleration: config.acceleration ?? 8,
      stoppingDistance: config.stoppingDistance ?? 0,
      radius: config.radius ?? 0.5,
      height: config.height ?? 2,
      obstacleAvoidanceType: config.obstacleAvoidanceType ?? "goodQuality",
      path: [],
      pathIndex: 0,
      isStopped: false,
      isOnNavMesh: false,
    };
    this.agents.set(id, agent);
    return agent;
  }

  setDestination(agentId: string, destination: THREE.Vector3): boolean {
    const agent = this.agents.get(agentId);
    if (!agent || !this.surface) return false;

    agent.destination = destination.clone();

    // Simple A* pathfinding
    const path = this.calculatePath(agent.position, destination);
    agent.path = path;
    agent.pathIndex = 0;
    agent.isStopped = false;

    return path.length > 0;
  }

  update(deltaTime: number): void {
    this.agents.forEach((agent) => {
      if (agent.isStopped || !agent.destination) return;

      // Check if reached destination
      if (agent.position.distanceTo(agent.destination) <= agent.stoppingDistance) {
        agent.velocity.set(0, 0, 0);
        agent.isStopped = true;
        return;
      }

      // Follow path
      if (agent.pathIndex < agent.path.length) {
        const target = agent.path[agent.pathIndex];
        const direction = new THREE.Vector3().subVectors(target, agent.position).normalize();

        // Smooth steering
        const desiredVelocity = direction.multiplyScalar(agent.speed);
        const steering = new THREE.Vector3().subVectors(desiredVelocity, agent.velocity);
        steering.clampLength(0, agent.acceleration * deltaTime);

        agent.velocity.add(steering);
        agent.velocity.clampLength(0, agent.speed);

        // Update position
        const movement = agent.velocity.clone().multiplyScalar(deltaTime);
        agent.position.add(movement);

        // Check if reached waypoint
        if (agent.position.distanceTo(target) < 0.5) {
          agent.pathIndex++;
        }
      }

      // Snap to navmesh
      if (this.surface) {
        const closest = this.surface.findClosestPointOnMesh(agent.position);
        if (closest) {
          agent.position.y = closest.y;
          agent.isOnNavMesh = true;
        }
      }
    });
  }

  private calculatePath(start: THREE.Vector3, end: THREE.Vector3): THREE.Vector3[] {
    // Simplified A* - direct path for now
    // In production, implement full A* with navmesh graph
    return [start.clone(), end.clone()];
  }

  getAgent(id: string): NavMeshAgent | undefined {
    return this.agents.get(id);
  }

  removeAgent(id: string): void {
    this.agents.delete(id);
  }

  stopAgent(id: string): void {
    const agent = this.agents.get(id);
    if (agent) {
      agent.isStopped = true;
      agent.velocity.set(0, 0, 0);
    }
  }

  resumeAgent(id: string): void {
    const agent = this.agents.get(id);
    if (agent) {
      agent.isStopped = false;
    }
  }
}
