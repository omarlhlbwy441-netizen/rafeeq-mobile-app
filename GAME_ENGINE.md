# 🎮 Rafeeq 3D Game Engine

> **Unity-like 3D game builder** powered by Three.js, built directly into Rafeeq.

## Features

### 🏗️ Editor (React Native + expo-gl)
- **Viewport** — Real-time 3D rendering with WebGL
- **Hierarchy Panel** — Scene object tree with selection
- **Inspector Panel** — Transform (Position/Rotation/Scale) editing
- **Toolbar** — Select, Move, Rotate, Scale tools
- **Play Mode** — Test games instantly

### 🧊 3D Objects
- Cube, Sphere, Cylinder, Cone, Torus, Plane
- Directional Light, Point Light, Spot Light
- Particle Systems (500+ particles with additive blending)
- Camera controls (Orbit, Zoom, Reset)

### 🎨 Material System
- **PBR Materials** — Standard, Metal, Glass, Emissive
- **8 Presets** — Rafeeq Blue, Purple, Green, Red, Gold, Glass, Glow, Wireframe
- **Custom Shaders** — Support for custom GLSL

### 🎬 Animation
- **Keyframe Animation** — Position, Rotation, Scale keyframes
- **5 Easing Types** — Linear, EaseIn, EaseOut, EaseInOut, Bounce
- **Loop/One-shot** modes

### 🔊 Audio
- **3D Positional Audio** — HRTF panning model
- **Spatial Mixing** — Distance-based attenuation
- **Master Volume** control

### ⚙️ Physics
- **RigidBody System** — Mass, velocity, angular velocity
- **Gravity** — Configurable global gravity
- **AABB Collision** — Elastic collision response
- **Forces & Impulses**

### 🌐 Backend API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/games/projects` | Create game project |
| GET | `/api/v1/games/projects` | List public projects |
| GET | `/api/v1/games/projects/my` | My projects |
| GET | `/api/v1/games/projects/{id}` | Project details |
| PATCH | `/api/v1/games/projects/{id}` | Update project |
| DELETE | `/api/v1/games/projects/{id}` | Delete project |
| POST | `/api/v1/games/projects/{id}/scenes` | Create scene |
| GET | `/api/v1/games/projects/{id}/scenes` | List scenes |
| GET | `/api/v1/games/scenes/{id}` | Scene details |
| PATCH | `/api/v1/games/scenes/{id}` | Update scene |
| DELETE | `/api/v1/games/scenes/{id}` | Delete scene |
| POST | `/api/v1/games/projects/{id}/assets` | Create asset |
| GET | `/api/v1/games/projects/{id}/assets` | List assets |
| GET | `/api/v1/games/assets/{id}` | Asset details |
| DELETE | `/api/v1/games/assets/{id}` | Delete asset |

## Architecture

```
src/engine/
├── core.ts        # RafeeqEngine: Scene, Camera, Renderer, Objects
├── input.ts       # InputManager: Touch, Keyboard, Mouse, Gyro
├── physics.ts     # PhysicsWorld: RigidBody, Gravity, Collisions
├── materials.ts   # MaterialLibrary: PBR, Presets, Custom Shaders
├── animation.ts   # Animator: Keyframes, Tweening, Easing
├── audio.ts       # AudioEngine: 3D Audio, Mixing, Spatial
└── index.ts       # Barrel exports
```

## Quick Start

```bash
# Install dependencies
npm install

# Start the app
npx expo start

# Navigate to Games → Create Project → Add Objects → Play!
```

## Demo Project

1. Open **Games** screen
2. Tap **+ Add** → Select **Cube**
3. Select the cube in **Hierarchy**
4. Edit **Position/Rotation/Scale** in Inspector
5. Tap **▶ Play** to see it rotate
6. Add **Particles** for visual effects
7. Add **Lights** for atmosphere
8. Tap **📁** to save your project
