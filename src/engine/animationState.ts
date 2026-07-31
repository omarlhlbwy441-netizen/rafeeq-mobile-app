"""Rafeeq Game Engine — Animation State Machine (Unity Animator architecture)"""
import * as THREE from "three";

export interface AnimatorState {
  name: string;
  clip: string;
  speed: number;
  normalizedTime: number;
  loop: boolean;
  transitions: AnimatorTransition[];
  motion: THREE.AnimationClip | null;
}

export interface AnimatorTransition {
  toState: string;
  duration: number;
  hasExitTime: boolean;
  exitTime: number;
  conditions: AnimatorCondition[];
}

export interface AnimatorCondition {
  parameter: string;
  mode: "equals" | "notEqual" | "greater" | "less";
  threshold: number;
}

export interface AnimatorParameter {
  name: string;
  type: "float" | "int" | "bool" | "trigger";
  defaultValue: number | boolean;
  value: number | boolean;
}

export class AnimatorStateMachine {
  states: Map<string, AnimatorState> = new Map();
  parameters: Map<string, AnimatorParameter> = new Map();
  currentState: AnimatorState | null = null;
  previousState: AnimatorState | null = null;
  transitionTime: number = 0;
  isTransitioning: boolean = false;
  defaultState: string = "";
  private mixer: THREE.AnimationMixer | null = null;
  private actions: Map<string, THREE.AnimationAction> = new Map();

  constructor(mixer: THREE.AnimationMixer) {
    this.mixer = mixer;
  }

  addState(state: AnimatorState): void {
    this.states.set(state.name, state);
    if (this.defaultState === "") {
      this.defaultState = state.name;
    }
  }

  addParameter(param: AnimatorParameter): void {
    this.parameters.set(param.name, { ...param, value: param.defaultValue });
  }

  setFloat(name: string, value: number): void {
    const param = this.parameters.get(name);
    if (param && param.type === "float") param.value = value;
  }

  setInt(name: string, value: number): void {
    const param = this.parameters.get(name);
    if (param && param.type === "int") param.value = value;
  }

  setBool(name: string, value: boolean): void {
    const param = this.parameters.get(name);
    if (param && param.type === "bool") param.value = value;
  }

  setTrigger(name: string): void {
    const param = this.parameters.get(name);
    if (param && param.type === "trigger") {
      param.value = true;
      this.evaluateTransitions();
      param.value = false;
    }
  }

  getFloat(name: string): number {
    const param = this.parameters.get(name);
    return (param?.type === "float" ? param.value : 0) as number;
  }

  getInt(name: string): number {
    const param = this.parameters.get(name);
    return (param?.type === "int" ? param.value : 0) as number;
  }

  getBool(name: string): boolean {
    const param = this.parameters.get(name);
    return (param?.type === "bool" ? param.value : false) as boolean;
  }

  play(stateName: string, normalizedTime: number = 0): void {
    const state = this.states.get(stateName);
    if (!state) return;

    if (this.currentState) {
      this.previousState = this.currentState;
    }

    this.currentState = state;
    state.normalizedTime = normalizedTime;

    // Play animation
    const action = this.actions.get(stateName);
    if (action) {
      action.reset().play();
      action.setEffectiveTimeScale(state.speed);
    }
  }

  crossFade(stateName: string, transitionDuration: number, normalizedTime: number = 0): void {
    const state = this.states.get(stateName);
    if (!state) return;

    const currentAction = this.currentState ? this.actions.get(this.currentState.name) : null;
    const nextAction = this.actions.get(stateName);

    if (currentAction && nextAction) {
      nextAction.reset().play();
      nextAction.setEffectiveTimeScale(state.speed);
      currentAction.crossFadeTo(nextAction, transitionDuration, false);
    }

    this.previousState = this.currentState;
    this.currentState = state;
    this.isTransitioning = true;
    this.transitionTime = 0;
  }

  update(deltaTime: number): void {
    if (this.isTransitioning) {
      this.transitionTime += deltaTime;
      if (this.currentState && this.transitionTime >= this.currentState.transitions[0]?.duration ?? 0.25) {
        this.isTransitioning = false;
      }
    }

    this.evaluateTransitions();
  }

  private evaluateTransitions(): void {
    if (!this.currentState) return;

    for (const transition of this.currentState.transitions) {
      if (this.checkConditions(transition.conditions)) {
        if (transition.hasExitTime && this.currentState.normalizedTime < transition.exitTime) {
          continue;
        }
        this.crossFade(transition.toState, transition.duration);
        break;
      }
    }
  }

  private checkConditions(conditions: AnimatorCondition[]): boolean {
    return conditions.every((cond) => {
      const param = this.parameters.get(cond.parameter);
      if (!param) return false;

      const value = param.value as number;
      switch (cond.mode) {
        case "equals": return Math.abs(value - cond.threshold) < 0.001;
        case "notEqual": return Math.abs(value - cond.threshold) >= 0.001;
        case "greater": return value > cond.threshold;
        case "less": return value < cond.threshold;
        default: return false;
      }
    });
  }

  addClip(name: string, clip: THREE.AnimationClip): void {
    if (this.mixer) {
      const action = this.mixer.clipAction(clip);
      this.actions.set(name, action);
    }
  }
}
