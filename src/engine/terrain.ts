"""Rafeeq Game Engine — Terrain System (Unity Terrain architecture)"""
import * as THREE from "three";

export interface TerrainLayer {
  name: string;
  diffuseTexture: string;
  normalTexture?: string;
  metallic: number;
  smoothness: number;
  tileSize: [number, number];
  tileOffset: [number, number];
}

export interface TerrainData {
  heightmapResolution: number;
  size: [number, number, number];
  heightmap: Float32Array;
  alphamap: Float32Array;
  layers: TerrainLayer[];
  detailPrototypes: string[];
  treePrototypes: string[];
  basemapDistance: number;
  detailObjectDistance: number;
  detailObjectDensity: number;
  treeDistance: number;
  treeBillboardDistance: number;
  treeCrossFadeLength: number;
  treeMaximumFullLODCount: number;
}

export class RafeeqTerrain {
  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
  material: THREE.MeshStandardMaterial;
  data: TerrainData;
  private heightmapTexture: THREE.DataTexture;
  private splatmapTexture: THREE.DataTexture;

  constructor(width: number = 100, height: number = 100, resolution: number = 128) {
    this.data = {
      heightmapResolution: resolution,
      size: [width, 10, height],
      heightmap: new Float32Array(resolution * resolution),
      alphamap: new Float32Array(resolution * resolution * 4),
      layers: [],
      detailPrototypes: [],
      treePrototypes: [],
      basemapDistance: 1000,
      detailObjectDistance: 80,
      detailObjectDensity: 1,
      treeDistance: 500,
      treeBillboardDistance: 50,
      treeCrossFadeLength: 5,
      treeMaximumFullLODCount: 50,
    };

    this.geometry = new THREE.PlaneGeometry(width, height, resolution - 1, resolution - 1);
    this.geometry.rotateX(-Math.PI / 2);

    this.material = new THREE.MeshStandardMaterial({
      color: 0x3d6e38,
      roughness: 0.9,
      metalness: 0.0,
      wireframe: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Initialize flat terrain
    this.flatten();
  }

  // ===== HEIGHTMAP =====
  flatten(height: number = 0): void {
    this.data.heightmap.fill(height);
    this.updateMesh();
  }

  setHeight(x: number, z: number, height: number): void {
    const res = this.data.heightmapResolution;
    const ix = Math.floor((x / this.data.size[0] + 0.5) * res);
    const iz = Math.floor((z / this.data.size[2] + 0.5) * res);
    if (ix >= 0 && ix < res && iz >= 0 && iz < res) {
      this.data.heightmap[iz * res + ix] = height;
    }
  }

  getHeight(x: number, z: number): number {
    const res = this.data.heightmapResolution;
    const nx = (x / this.data.size[0] + 0.5);
    const nz = (z / this.data.size[2] + 0.5);
    const ix = Math.floor(nx * res);
    const iz = Math.floor(nz * res);

    if (ix < 0 || ix >= res - 1 || iz < 0 || iz >= res - 1) return 0;

    // Bilinear interpolation
    const fx = nx * res - ix;
    const fz = nz * res - iz;
    const h00 = this.data.heightmap[iz * res + ix];
    const h10 = this.data.heightmap[iz * res + ix + 1];
    const h01 = this.data.heightmap[(iz + 1) * res + ix];
    const h11 = this.data.heightmap[(iz + 1) * res + ix + 1];

    return h00 * (1 - fx) * (1 - fz) +
           h10 * fx * (1 - fz) +
           h01 * (1 - fx) * fz +
           h11 * fx * fz;
  }

  getNormal(x: number, z: number): THREE.Vector3 {
    const delta = 0.1;
    const hL = this.getHeight(x - delta, z);
    const hR = this.getHeight(x + delta, z);
    const hD = this.getHeight(x, z - delta);
    const hU = this.getHeight(x, z + delta);
    return new THREE.Vector3(hL - hR, 2 * delta, hD - hU).normalize();
  }

  // ===== PROCEDURAL GENERATION =====
  perlinNoise(octaves: number = 4, persistence: number = 0.5, lacunarity: number = 2, scale: number = 50): void {
    const res = this.data.heightmapResolution;
    for (let z = 0; z < res; z++) {
      for (let x = 0; x < res; x++) {
        let amplitude = 1;
        let frequency = 1 / scale;
        let noiseHeight = 0;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
          const sampleX = x * frequency;
          const sampleZ = z * frequency;
          const perlin = this.simplex2D(sampleX, sampleZ);
          noiseHeight += perlin * amplitude;
          maxValue += amplitude;
          amplitude *= persistence;
          frequency *= lacunarity;
        }

        this.data.heightmap[z * res + x] = (noiseHeight / maxValue) * this.data.size[1];
      }
    }
    this.updateMesh();
  }

  diamondSquare(roughness: number = 0.5): void {
    const res = this.data.heightmapResolution;
    const size = res - 1;

    // Initialize corners
    this.data.heightmap[0] = Math.random() * this.data.size[1];
    this.data.heightmap[size] = Math.random() * this.data.size[1];
    this.data.heightmap[size * res] = Math.random() * this.data.size[1];
    this.data.heightmap[size * res + size] = Math.random() * this.data.size[1];

    let step = size;
    let scale = roughness;

    while (step > 1) {
      const half = step / 2;

      // Diamond step
      for (let z = 0; z < size; z += step) {
        for (let x = 0; x < size; x += step) {
          const avg = (
            this.data.heightmap[z * res + x] +
            this.data.heightmap[z * res + x + step] +
            this.data.heightmap[(z + step) * res + x] +
            this.data.heightmap[(z + step) * res + x + step]
          ) / 4;
          this.data.heightmap[(z + half) * res + x + half] = avg + (Math.random() - 0.5) * step * scale;
        }
      }

      // Square step
      for (let z = 0; z <= size; z += half) {
        for (let x = (z + half) % step; x <= size; x += step) {
          let sum = 0;
          let count = 0;
          if (z >= half) { sum += this.data.heightmap[(z - half) * res + x]; count++; }
          if (z + half <= size) { sum += this.data.heightmap[(z + half) * res + x]; count++; }
          if (x >= half) { sum += this.data.heightmap[z * res + x - half]; count++; }
          if (x + half <= size) { sum += this.data.heightmap[z * res + x + half]; count++; }
          this.data.heightmap[z * res + x] = sum / count + (Math.random() - 0.5) * step * scale;
        }
      }

      step /= 2;
      scale /= 2;
    }

    this.updateMesh();
  }

  // ===== SMOOTHING =====
  smooth(iterations: number = 1): void {
    const res = this.data.heightmapResolution;
    for (let iter = 0; iter < iterations; iter++) {
      const newHeightmap = new Float32Array(this.data.heightmap);
      for (let z = 1; z < res - 1; z++) {
        for (let x = 1; x < res - 1; x++) {
          const idx = z * res + x;
          newHeightmap[idx] = (
            this.data.heightmap[idx] * 4 +
            this.data.heightmap[idx - 1] +
            this.data.heightmap[idx + 1] +
            this.data.heightmap[idx - res] +
            this.data.heightmap[idx + res]
          ) / 8;
        }
      }
      this.data.heightmap = newHeightmap;
    }
    this.updateMesh();
  }

  // ===== PAINTING =====
  paintSplatmap(x: number, z: number, radius: number, layerIndex: number, intensity: number = 1): void {
    const res = this.data.heightmapResolution;
    const cx = Math.floor((x / this.data.size[0] + 0.5) * res);
    const cz = Math.floor((z / this.data.size[2] + 0.5) * res);
    const r = Math.floor((radius / this.data.size[0]) * res);

    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        const px = cx + dx;
        const pz = cz + dz;
        if (px >= 0 && px < res && pz >= 0 && pz < res) {
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist <= r) {
            const falloff = 1 - (dist / r);
            const idx = (pz * res + px) * 4 + layerIndex;
            this.data.alphamap[idx] = Math.min(1, this.data.alphamap[idx] + falloff * intensity);
          }
        }
      }
    }
  }

  // ===== INTERNAL =====
  private updateMesh(): void {
    const positions = this.geometry.attributes.position.array as Float32Array;
    const res = this.data.heightmapResolution;
    const width = this.data.size[0];
    const depth = this.data.size[2];

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      const nx = (x / width + 0.5) * (res - 1);
      const nz = (z / depth + 0.5) * (res - 1);
      const ix = Math.floor(nx);
      const iz = Math.floor(nz);

      if (ix >= 0 && ix < res - 1 && iz >= 0 && iz < res - 1) {
        const fx = nx - ix;
        const fz = nz - iz;
        const h00 = this.data.heightmap[iz * res + ix];
        const h10 = this.data.heightmap[iz * res + ix + 1];
        const h01 = this.data.heightmap[(iz + 1) * res + ix];
        const h11 = this.data.heightmap[(iz + 1) * res + ix + 1];
        positions[i + 1] = h00 * (1 - fx) * (1 - fz) + h10 * fx * (1 - fz) + h01 * (1 - fx) * fz + h11 * fx * fz;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  private simplex2D(x: number, y: number): number {
    // Simplified noise function
    return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;
  }

  serialize(): TerrainData {
    return {
      ...this.data,
      heightmap: this.data.heightmap.slice(),
      alphamap: this.data.alphamap.slice(),
    };
  }
}
