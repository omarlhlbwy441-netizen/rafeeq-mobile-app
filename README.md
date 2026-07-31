# 🐺 رفيق (Rafeeq) — v3.2.0

> **Your Intelligent AI Companion** — The most powerful digital ecosystem with the strongest kernel.

[![Version](https://img.shields.io/badge/version-3.2.0-blue)](https://github.com/omarlhlbwy441-netizen/rafeeq-mobile-app)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/frontend-Expo%20%2B%20React%20Native-4630EB)](https://expo.dev)
[![Game Engine](https://img.shields.io/badge/game%20engine-Unity%20Spec-orange)](GAME_ENGINE.md)

---

## 🚀 What's New in v3.2.0 — Unity-Spec Game Engine

### 🎮 Complete 3D Game Engine
- **Component System** — MonoBehaviour architecture (Transform, MeshRenderer, Camera, Light, Rigidbody, Collider)
- **Prefab System** — Templates, Variants, Overrides, 7 built-in prefabs
- **Scene Manager** — Load/Unload, Additive loading, Build Settings
- **Scripting** — MonoBehaviour lifecycle, Coroutines, 5 example scripts
- **Event System** — UnityEvents, EventBus, 16 built-in engine events
- **Build Pipeline** — WebGL/Android/iOS export with progress tracking
- **Post-Processing** — Bloom, SSAO, Vignette, Chromatic Aberration, FXAA, Tone Mapping
- **Terrain** — Heightmap, Perlin Noise, Diamond-Square, Smoothing, Splatmap
- **AI Navigation** — NavMeshSurface, NavMeshAgent, A* Pathfinding, Steering
- **Animation** — State Machine, Transitions, Parameters, CrossFade
- **LOD** — Screen-relative, Cross-fade, Triangle counting
- **Save/Load** — PlayerPrefs, 10 Save Slots, Settings, Cloud Save
- **UI Canvas** — Screen-space/World-space, 9 Anchors, 9 Pivots, 7 UI elements
- **Physics Joints** — Fixed, Hinge (Limits/Motor/Spring), Spring, Distance

### 📱 Mobile App
- **Game Editor** — Unity-like viewport with Hierarchy, Inspector, Toolbar
- **3D Viewport** — Real-time WebGL rendering with expo-gl
- **Object Manipulation** — Add/Delete/Duplicate, Transform editing
- **Play Mode** — Test games instantly

---

## 🏗️ Architecture

```
rafeeq-mobile-app/
├── 📱 Mobile App (Expo + React Native + Three.js)
│   ├── src/
│   │   ├── engine/           # Unity-Spec Game Engine (20 modules)
│   │   │   ├── core.ts       # RafeeqEngine (Renderer, Scene, Camera)
│   │   │   ├── component.ts  # MonoBehaviour Component System
│   │   │   ├── prefab.ts     # Prefab System
│   │   │   ├── sceneManager.ts # Scene Manager
│   │   │   ├── scripting.ts  # MonoBehaviour Scripts
│   │   │   ├── events.ts     # UnityEvent System
│   │   │   ├── build.ts      # Build Pipeline
│   │   │   ├── postprocess.ts # Post-Processing Stack
│   │   │   ├── terrain.ts    # Terrain System
│   │   │   ├── navmesh.ts    # AI Navigation
│   │   │   ├── animationState.ts # Animation State Machine
│   │   │   ├── lod.ts        # LOD System
│   │   │   ├── saveLoad.ts   # Save/Load System
│   │   │   ├── ui.ts         # UI Canvas System
│   │   │   ├── joints.ts     # Physics Joints
│   │   │   ├── input.ts      # Input Manager
│   │   │   ├── physics.ts    # Physics World
│   │   │   ├── materials.ts  # Material Library
│   │   │   ├── animation.ts  # Keyframe Animation
│   │   │   ├── audio.ts      # Audio Engine
│   │   │   └── index.ts      # Barrel exports
│   │   ├── screens/
│   │   │   └── GamesScreen.tsx # Unity-like 3D Editor
│   │   └── ...
│
├── ⚙️ Backend (FastAPI)
│   ├── Game Engine API (Projects/Scenes/Assets)
│   └── ... (Auth, Stores, Products, Admin)
│
└── 🐳 DevOps (Docker, Render, CI/CD)
```

---

## 🎮 Game Engine Systems

| System | Unity Equivalent | Status |
|--------|-----------------|--------|
| Component System | MonoBehaviour | ✅ Complete |
| Prefab System | Prefab/Variant | ✅ Complete |
| Scene Manager | SceneManager | ✅ Complete |
| Scripting | C# Scripts | ✅ Complete |
| Event System | UnityEvent | ✅ Complete |
| Build Pipeline | Build Settings | ✅ Complete |
| Post-Processing | Post-Processing Stack | ✅ Complete |
| Terrain | Terrain System | ✅ Complete |
| AI Navigation | NavMesh | ✅ Complete |
| Animation | Animator/State Machine | ✅ Complete |
| LOD | LODGroup | ✅ Complete |
| Save/Load | PlayerPrefs/Save System | ✅ Complete |
| UI | Canvas/UGUI | ✅ Complete |
| Physics Joints | Joint Components | ✅ Complete |
| Input | Input System | ✅ Complete |
| Audio | AudioSource | ✅ Complete |
| Materials | Material/Shader | ✅ Complete |
| Particles | Particle System | ✅ Complete |

---

## 🛠️ Quick Start

### Game Development
```bash
# Install dependencies
npm install

# Start the app
npx expo start

# Navigate to Games → Create Project → Build your game!
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 📡 API Reference

See [GAME_ENGINE.md](GAME_ENGINE.md) for complete Game Engine API documentation.

---

## 🐺 Powered by Wolf Digital Kingdom

**[GitHub](https://github.com/omarlhlbwy441-netizen/rafeeq-mobile-app)** | **Version 3.2.0** | **2026**
