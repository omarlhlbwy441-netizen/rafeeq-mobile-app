"""Rafeeq Game Engine — 2D Sprite & Tilemap System (Unity 2D architecture)"""
import * as THREE from "three";

// ===== SPRITE =====
export interface SpriteData {
  texture: string;
  rect: { x: number; y: number; width: number; height: number };
  pivot: [number, number];
  pixelsPerUnit: number;
}

export class RafeeqSprite {
  texture: THREE.Texture | null = null;
  rect: { x: number; y: number; width: number; height: number };
  pivot: THREE.Vector2;
  pixelsPerUnit: number;
  color: THREE.Color = new THREE.Color(1, 1, 1);
  flipX: boolean = false;
  flipY: boolean = false;
  drawMode: "simple" | "sliced" | "tiled" | "filled" = "simple";
  fillAmount: number = 1;
  fillMethod: "horizontal" | "vertical" | "radial90" | "radial180" | "radial360" = "radial360";
  fillOrigin: number = 0;
  fillClockwise: boolean = true;
  maskInteraction: "none" | "visibleInsideMask" | "visibleOutsideMask" = "none";
  sortingLayerID: number = 0;
  sortingOrder: number = 0;

  constructor(texture: string, rect?: { x: number; y: number; width: number; height: number }) {
    this.rect = rect ?? { x: 0, y: 0, width: 100, height: 100 };
    this.pivot = new THREE.Vector2(0.5, 0.5);
    this.pixelsPerUnit = 100;
  }

  setTexture(texture: THREE.Texture): void {
    this.texture = texture;
  }

  getBounds(): THREE.Box2 {
    const w = this.rect.width / this.pixelsPerUnit;
    const h = this.rect.height / this.pixelsPerUnit;
    return new THREE.Box2(
      new THREE.Vector2(-w * this.pivot.x, -h * this.pivot.y),
      new THREE.Vector2(w * (1 - this.pivot.x), h * (1 - this.pivot.y))
    );
  }
}

// ===== SPRITE RENDERER =====
export class SpriteRenderer {
  sprite: RafeeqSprite | null = null;
  color: THREE.Color = new THREE.Color(1, 1, 1);
  flipX: boolean = false;
  flipY: boolean = false;
  material: THREE.Material = new THREE.MeshBasicMaterial({ transparent: true });
  drawMode: "simple" | "sliced" | "tiled" = "simple";
  size: THREE.Vector2 = new THREE.Vector2(1, 1);
  adaptiveModeThreshold: number = 0.5;
  tileMode: "continuous" | "adaptive" = "continuous";
  maskInteraction: "none" | "visibleInsideMask" | "visibleOutsideMask" = "none";
  sortingLayerID: number = 0;
  sortingOrder: number = 0;
  private mesh: THREE.Mesh;

  constructor() {
    const geometry = new THREE.PlaneGeometry(1, 1);
    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  setSprite(sprite: RafeeqSprite): void {
    this.sprite = sprite;
    if (sprite.texture) {
      (this.material as THREE.MeshBasicMaterial).map = sprite.texture;
      this.material.needsUpdate = true;
    }
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  update(): void {
    if (!this.sprite) return;
    const w = this.sprite.rect.width / this.sprite.pixelsPerUnit * this.size.x;
    const h = this.sprite.rect.height / this.sprite.pixelsPerUnit * this.size.y;
    this.mesh.scale.set(w, h, 1);
  }
}

// ===== TILEMAP =====
export interface Tile {
  sprite: string;
  color: THREE.Color;
  transform: { position: [number, number]; rotation: number; scale: [number, number] };
  flags: { flipHorizontal: boolean; flipVertical: boolean; flipDiagonal: boolean };
  colliderType: "none" | "sprite" | "grid";
}

export class TilePalette {
  tiles: Map<string, Tile> = new Map();

  addTile(id: string, tile: Tile): void {
    this.tiles.set(id, tile);
  }

  getTile(id: string): Tile | undefined {
    return this.tiles.get(id);
  }
}

export class Tilemap {
  name: string;
  cellSize: [number, number] = [1, 1];
  cellGap: [number, number] = [0, 0];
  tileAnchor: [number, number] = [0.5, 0.5];
  orientation: "orthogonal" | "isometric" | "hexagonal" = "orthogonal";
  layers: Map<string, Map<string, Tile>> = new Map();
  private geometry: THREE.InstancedMesh | null = null;

  constructor(name: string = "Tilemap") {
    this.name = name;
  }

  setTile(x: number, y: number, tile: Tile, layer: string = "default"): void {
    if (!this.layers.has(layer)) {
      this.layers.set(layer, new Map());
    }
    this.layers.get(layer)!.set(`${x},${y}`, tile);
  }

  getTile(x: number, y: number, layer: string = "default"): Tile | undefined {
    return this.layers.get(layer)?.get(`${x},${y}`);
  }

  removeTile(x: number, y: number, layer: string = "default"): void {
    this.layers.get(layer)?.delete(`${x},${y}`);
  }

  clearLayer(layer: string = "default"): void {
    this.layers.delete(layer);
  }

  clearAll(): void {
    this.layers.clear();
  }

  getBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    this.layers.forEach((layer) => {
      layer.forEach((_, key) => {
        const [x, y] = key.split(",").map(Number);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    });
    return { minX, minY, maxX, maxY };
  }

  getTileCount(): number {
    let count = 0;
    this.layers.forEach((layer) => (count += layer.size));
    return count;
  }

  fillRectangle(x: number, y: number, width: number, height: number, tile: Tile, layer: string = "default"): void {
    for (let dx = 0; dx < width; dx++) {
      for (let dy = 0; dy < height; dy++) {
        this.setTile(x + dx, y + dy, tile, layer);
      }
    }
  }

  floodFill(startX: number, startY: number, tile: Tile, layer: string = "default"): void {
    const targetLayer = this.layers.get(layer);
    if (!targetLayer) return;
    const startKey = `${startX},${startY}`;
    const startTile = targetLayer.get(startKey);
    if (startTile && startTile.sprite === tile.sprite) return;

    const queue: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      const key = `${cx},${cy}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const current = targetLayer.get(key);
      if (current && current.sprite !== (startTile?.sprite ?? "")) continue;

      this.setTile(cx, cy, tile, layer);

      queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }

  serialize(): object {
    const data: Record<string, Record<string, any>> = {};
    this.layers.forEach((layer, layerName) => {
      data[layerName] = {};
      layer.forEach((tile, key) => {
        data[layerName][key] = {
          sprite: tile.sprite,
          color: tile.color.getHex(),
          colliderType: tile.colliderType,
        };
      });
    });
    return {
      name: this.name,
      cellSize: this.cellSize,
      cellGap: this.cellGap,
      orientation: this.orientation,
      layers: data,
    };
  }
}

// ===== TILEMAP COLLIDER =====
export class TilemapCollider {
  tilemap: Tilemap;
  usedByComposite: boolean = false;
  offset: THREE.Vector2 = new THREE.Vector2(0, 0);

  constructor(tilemap: Tilemap) {
    this.tilemap = tilemap;
  }

  getCollisionShapes(): Array<{ x: number; y: number; width: number; height: number }> {
    const shapes: Array<{ x: number; y: number; width: number; height: number }> = [];
    this.tilemap.layers.forEach((layer) => {
      layer.forEach((tile, key) => {
        if (tile.colliderType !== "none") {
          const [x, y] = key.split(",").map(Number);
          shapes.push({
            x: x * this.tilemap.cellSize[0],
            y: y * this.tilemap.cellSize[1],
            width: this.tilemap.cellSize[0],
            height: this.tilemap.cellSize[1],
          });
        }
      });
    });
    return shapes;
  }
}

// ===== ANIMATED TILE =====
export class AnimatedTile {
  sprites: string[] = [];
  animationSpeed: number = 1;
  animationStartTime: number = 0;
  private currentFrame: number = 0;

  constructor(sprites: string[]) {
    this.sprites = sprites;
  }

  update(deltaTime: number): string {
    this.animationStartTime += deltaTime * this.animationSpeed;
    this.currentFrame = Math.floor(this.animationStartTime) % this.sprites.length;
    return this.sprites[this.currentFrame];
  }
}
