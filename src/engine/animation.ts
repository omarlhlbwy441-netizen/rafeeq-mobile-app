"""Rafeeq Game Engine — Animation System (Keyframes, Tweening, Skeletal)"""
import * as THREE from "three";

export interface Keyframe {
  time: number; // seconds
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut" | "bounce";
}

export interface AnimationClip {
  name: string;
  duration: number;
  loop: boolean;
  keyframes: Keyframe[];
}

export class Animator {
  private clips: Map<string, AnimationClip> = new Map();
  private activeAnimations: Map<string, {
    clip: AnimationClip;
    object: THREE.Object3D;
    startTime: number;
    elapsed: number;
  }> = new Map();

  createClip(name: string, keyframes: Keyframe[], loop: boolean = true): AnimationClip {
    const duration = keyframes[keyframes.length - 1]?.time ?? 1;
    const clip: AnimationClip = { name, duration, loop, keyframes };
    this.clips.set(name, clip);
    return clip;
  }

  play(clipName: string, object: THREE.Object3D, speed: number = 1): void {
    const clip = this.clips.get(clipName);
    if (!clip) return;

    this.activeAnimations.set(`${clipName}_${object.uuid}`, {
      clip,
      object,
      startTime: Date.now(),
      elapsed: 0,
    });
  }

  stop(clipName: string, object: THREE.Object3D): void {
    this.activeAnimations.delete(`${clipName}_${object.uuid}`);
  }

  stopAll(object: THREE.Object3D): void {
    for (const [key, anim] of this.activeAnimations) {
      if (anim.object === object) {
        this.activeAnimations.delete(key);
      }
    }
  }

  update(delta: number): void {
    const now = Date.now();

    for (const [key, anim] of this.activeAnimations) {
      anim.elapsed += delta;

      const { clip, object } = anim;
      const t = clip.loop
        ? anim.elapsed % clip.duration
        : Math.min(anim.elapsed, clip.duration);

      // Find surrounding keyframes
      const kfs = clip.keyframes;
      let prev = kfs[0];
      let next = kfs[kfs.length - 1];

      for (let i = 0; i < kfs.length - 1; i++) {
        if (t >= kfs[i].time && t <= kfs[i + 1].time) {
          prev = kfs[i];
          next = kfs[i + 1];
          break;
        }
      }

      const segmentDuration = next.time - prev.time;
      const segmentT = segmentDuration > 0 ? (t - prev.time) / segmentDuration : 0;
      const easedT = this.applyEasing(segmentT, next.easing ?? "linear");

      // Interpolate
      if (prev.position && next.position) {
        object.position.set(
          this.lerp(prev.position[0], next.position[0], easedT),
          this.lerp(prev.position[1], next.position[1], easedT),
          this.lerp(prev.position[2], next.position[2], easedT)
        );
      }

      if (prev.rotation && next.rotation) {
        object.rotation.set(
          this.lerp(prev.rotation[0], next.rotation[0], easedT),
          this.lerp(prev.rotation[1], next.rotation[1], easedT),
          this.lerp(prev.rotation[2], next.rotation[2], easedT)
        );
      }

      if (prev.scale && next.scale) {
        object.scale.set(
          this.lerp(prev.scale[0], next.scale[0], easedT),
          this.lerp(prev.scale[1], next.scale[1], easedT),
          this.lerp(prev.scale[2], next.scale[2], easedT)
        );
      }

      // Remove finished non-looping animations
      if (!clip.loop && anim.elapsed >= clip.duration) {
        this.activeAnimations.delete(key);
      }
    }
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  private applyEasing(t: number, easing: string): number {
    switch (easing) {
      case "easeIn": return t * t;
      case "easeOut": return 1 - (1 - t) * (1 - t);
      case "easeInOut": return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      case "bounce": {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        else return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
      default: return t;
    }
  }
}
