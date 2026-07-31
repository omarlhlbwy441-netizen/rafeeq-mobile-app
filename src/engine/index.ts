export {
  RafeeqEngine,
  type GameObject,
  type GameComponent,
  type EngineConfig,
} from "./core";

export { InputManager, type InputState } from "./input";
export { PhysicsWorld, type RigidBody } from "./physics";
export { MaterialLibrary, MaterialPresets, type MaterialConfig, type MaterialType } from "./materials";
export { Animator, type AnimationClip, type Keyframe } from "./animation";
export { AudioEngine, type AudioSource } from "./audio";

// Unity-spec systems
export {
  RafeeqComponent,
  Transform,
  MeshRenderer,
  Camera,
  Light,
  Rigidbody,
  Collider,
  GameObject,
  type ComponentType,
  type ComponentData,
} from "./component";

export { Prefab, PrefabLibrary, type PrefabData } from "./prefab";
export { RafeeqScene, SceneManager, type SceneData } from "./sceneManager";
export { MonoBehaviour, Rotator, Mover, Oscillator, LookAtCamera, Billboard } from "./scripting";
export { UnityEvent, EventBus, EngineEvents } from "./events";
export { BuildPipeline, type BuildSettings, type BuildTarget } from "./build";
export { PostProcessStack, type PostProcessProfile } from "./postprocess";
export { RafeeqTerrain, type TerrainData, type TerrainLayer } from "./terrain";
export { NavMeshSurface, NavMeshPath, NavMeshAgentController, type NavMeshAgent } from "./navmesh";
export { AnimatorStateMachine, type AnimatorState, type AnimatorTransition, type AnimatorParameter } from "./animationState";
export { RafeeqLOD, LODGroup, type LODLevel } from "./lod";
export { SaveManager, type SaveData, type GameSettings, type CheckpointData, type GameStatistics } from "./saveLoad";
export { RafeeqCanvas, type UIElement, type RectTransform, type UIAnchor, type UIPivot } from "./ui";
export { FixedJoint, HingeJoint, SpringJoint, DistanceJoint, JointSystem, type Joint } from "./joints";
