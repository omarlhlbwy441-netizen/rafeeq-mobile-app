"""Rafeeq Game Engine — Event System (UnityEvents architecture)"""

export type UnityAction<T = void> = T extends void ? () => void : (arg: T) => void;

export class UnityEvent<T = void> {
  private listeners: Array<{ callback: UnityAction<T>; priority: number }> = [];
  private onceListeners: Array<{ callback: UnityAction<T>; priority: number }> = [];

  addListener(callback: UnityAction<T>, priority: number = 0): void {
    this.listeners.push({ callback, priority });
    this.listeners.sort((a, b) => b.priority - a.priority);
  }

  removeListener(callback: UnityAction<T>): void {
    this.listeners = this.listeners.filter((l) => l.callback !== callback);
    this.onceListeners = this.onceListeners.filter((l) => l.callback !== callback);
  }

  addOnce(callback: UnityAction<T>, priority: number = 0): void {
    this.onceListeners.push({ callback, priority });
    this.onceListeners.sort((a, b) => b.priority - a.priority);
  }

  removeAllListeners(): void {
    this.listeners = [];
    this.onceListeners = [];
  }

  invoke(arg?: T): void {
    const all = [...this.listeners, ...this.onceListeners];
    all.forEach((l) => {
      if (arg !== undefined) {
        (l.callback as any)(arg);
      } else {
        (l.callback as any)();
      }
    });
    this.onceListeners = [];
  }

  get listenerCount(): number {
    return this.listeners.length + this.onceListeners.length;
  }
}

// Global event bus
export class EventBus {
  private static events: Map<string, UnityEvent<any>> = new Map();

  static on<T>(eventName: string, callback: UnityAction<T>, priority: number = 0): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new UnityEvent<T>());
    }
    this.events.get(eventName)!.addListener(callback, priority);
  }

  static once<T>(eventName: string, callback: UnityAction<T>, priority: number = 0): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new UnityEvent<T>());
    }
    this.events.get(eventName)!.addOnce(callback, priority);
  }

  static off<T>(eventName: string, callback: UnityAction<T>): void {
    this.events.get(eventName)?.removeListener(callback);
  }

  static emit<T>(eventName: string, arg?: T): void {
    this.events.get(eventName)?.invoke(arg);
  }

  static removeAll(eventName: string): void {
    this.events.get(eventName)?.removeAllListeners();
  }

  static clear(): void {
    this.events.clear();
  }
}

// Built-in engine events
export const EngineEvents = {
  SCENE_LOADED: "engine:scene_loaded",
  SCENE_UNLOADED: "engine:scene_unloaded",
  OBJECT_CREATED: "engine:object_created",
  OBJECT_DESTROYED: "engine:object_destroyed",
  COLLISION_ENTER: "engine:collision_enter",
  COLLISION_EXIT: "engine:collision_exit",
  TRIGGER_ENTER: "engine:trigger_enter",
  TRIGGER_EXIT: "engine:trigger_exit",
  GAME_START: "engine:game_start",
  GAME_PAUSE: "engine:game_pause",
  GAME_RESUME: "engine:game_resume",
  GAME_STOP: "engine:game_stop",
  INPUT_DOWN: "engine:input_down",
  INPUT_UP: "engine:input_up",
  INPUT_MOVE: "engine:input_move",
  RENDER_PRE: "engine:render_pre",
  RENDER_POST: "engine:render_post",
} as const;
