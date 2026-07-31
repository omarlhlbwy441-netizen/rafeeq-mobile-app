"""Rafeeq Game Engine — Post-Processing Stack (Unity Post-Processing architecture)"""
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

export interface PostProcessProfile {
  bloom: {
    enabled: boolean;
    intensity: number;
    threshold: number;
    radius: number;
  };
  ambientOcclusion: {
    enabled: boolean;
    radius: number;
    intensity: number;
  };
  motionBlur: {
    enabled: boolean;
    shutterAngle: number;
    sampleCount: number;
  };
  colorGrading: {
    enabled: boolean;
    temperature: number;
    tint: number;
    saturation: number;
    contrast: number;
    brightness: number;
  };
  vignette: {
    enabled: boolean;
    intensity: number;
    smoothness: number;
    color: number;
  };
  chromaticAberration: {
    enabled: boolean;
    intensity: number;
  };
  antialiasing: "none" | "fxaa" | "smaa" | "taa";
  toneMapping: "none" | "aces" | "reinhard" | "filmic";
}

export class PostProcessStack {
  composer: EffectComposer;
  profile: PostProcessProfile;
  renderPass: RenderPass;
  private passes: Map<string, any> = new Map();

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.composer = new EffectComposer(renderer);
    this.renderPass = new RenderPass(scene, camera);
    this.composer.addPass(this.renderPass);

    this.profile = {
      bloom: { enabled: false, intensity: 0.5, threshold: 0.8, radius: 0.5 },
      ambientOcclusion: { enabled: false, radius: 0.5, intensity: 1 },
      motionBlur: { enabled: false, shutterAngle: 270, sampleCount: 10 },
      colorGrading: { enabled: false, temperature: 0, tint: 0, saturation: 1, contrast: 1, brightness: 1 },
      vignette: { enabled: false, intensity: 0.4, smoothness: 0.2, color: 0x000000 },
      chromaticAberration: { enabled: false, intensity: 0.05 },
      antialiasing: "fxaa",
      toneMapping: "aces",
    };

    this.setupDefaultPasses();
  }

  private setupDefaultPasses(): void {
    // FXAA
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    this.composer.addPass(fxaaPass);
    this.passes.set("fxaa", fxaaPass);

    // Gamma correction
    const gammaPass = new ShaderPass(GammaCorrectionShader);
    this.composer.addPass(gammaPass);
    this.passes.set("gamma", gammaPass);
  }

  enableBloom(intensity: number = 0.5, threshold: number = 0.8, radius: number = 0.5): void {
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      intensity,
      radius,
      threshold
    );
    this.composer.addPass(bloomPass);
    this.passes.set("bloom", bloomPass);
    this.profile.bloom = { enabled: true, intensity, threshold, radius };
  }

  enableSSAO(radius: number = 0.5, intensity: number = 1): void {
    // SSAO requires depth pass - simplified
    this.profile.ambientOcclusion = { enabled: true, radius, intensity };
  }

  enableVignette(intensity: number = 0.4, smoothness: number = 0.2, color: number = 0x000000): void {
    const vignetteShader = {
      uniforms: {
        tDiffuse: { value: null },
        intensity: { value: intensity },
        smoothness: { value: smoothness },
        color: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float intensity;
        uniform float smoothness;
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float vignette = smoothstep(0.5, 0.5 - smoothness, dist);
          texel.rgb = mix(color, texel.rgb, vignette * (1.0 - intensity) + intensity);
          gl_FragColor = texel;
        }
      `,
    };
    const pass = new ShaderPass(vignetteShader);
    this.composer.addPass(pass);
    this.passes.set("vignette", pass);
    this.profile.vignette = { enabled: true, intensity, smoothness, color };
  }

  enableChromaticAberration(intensity: number = 0.05): void {
    const caShader = {
      uniforms: {
        tDiffuse: { value: null },
        intensity: { value: intensity },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float intensity;
        varying vec2 vUv;
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          vec2 direction = normalize(center);
          float r = texture2D(tDiffuse, vUv + direction * dist * intensity).r;
          float g = texture2D(tDiffuse, vUv).g;
          float b = texture2D(tDiffuse, vUv - direction * dist * intensity).b;
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `,
    };
    const pass = new ShaderPass(caShader);
    this.composer.addPass(pass);
    this.passes.set("chromaticAberration", pass);
    this.profile.chromaticAberration = { enabled: true, intensity };
  }

  setToneMapping(type: "none" | "aces" | "reinhard" | "filmic"): void {
    this.profile.toneMapping = type;
  }

  render(): void {
    this.composer.render();
  }

  resize(width: number, height: number): void {
    this.composer.setSize(width, height);
    const fxaa = this.passes.get("fxaa");
    if (fxaa) {
      fxaa.uniforms["resolution"].value.set(1 / width, 1 / height);
    }
  }

  dispose(): void {
    this.composer.dispose();
    this.passes.forEach((pass) => pass.dispose?.());
    this.passes.clear();
  }

  serialize(): PostProcessProfile {
    return { ...this.profile };
  }
}
