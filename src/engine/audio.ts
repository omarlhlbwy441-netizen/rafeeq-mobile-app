"""Rafeeq Game Engine — Audio System (3D positional audio, effects, mixing)"""

export interface AudioSource {
  id: string;
  url: string;
  volume: number;
  pitch: number;
  loop: boolean;
  spatial: boolean;
  position: [number, number, number];
  maxDistance: number;
  refDistance: number;
  rolloffFactor: number;
}

export class AudioEngine {
  private context: AudioContext | null = null;
  private sources: Map<string, AudioBufferSourceNode> = new Map();
  private gains: Map<string, GainNode> = new Map();
  private panner: Map<string, PannerNode> = new Map();
  private buffers: Map<string, AudioBuffer> = new Map();
  private masterGain: GainNode | null = null;
  private listener: AudioListener | null = null;

  async init(): Promise<void> {
    this.context = new AudioContext();
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.masterGain.gain.value = 1.0;
    this.listener = this.context.listener;
  }

  async load(id: string, url: string): Promise<void> {
    if (!this.context) return;
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await this.context.decodeAudioData(arrayBuffer);
    this.buffers.set(id, buffer);
  }

  play(config: AudioSource): void {
    if (!this.context || !this.masterGain) return;

    const buffer = this.buffers.get(config.id);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = config.loop;
    source.playbackRate.value = config.pitch;

    const gain = this.context.createGain();
    gain.gain.value = config.volume;

    if (config.spatial) {
      const panner = this.context.createPanner();
      panner.positionX.value = config.position[0];
      panner.positionY.value = config.position[1];
      panner.positionZ.value = config.position[2];
      panner.maxDistance = config.maxDistance;
      panner.refDistance = config.refDistance;
      panner.rolloffFactor = config.rolloffFactor;
      panner.panningModel = "HRTF";
      panner.distanceModel = "inverse";

      source.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);
      this.panner.set(config.id, panner);
    } else {
      source.connect(gain);
      gain.connect(this.masterGain);
    }

    source.start(0);
    this.sources.set(config.id, source);
    this.gains.set(config.id, gain);
  }

  stop(id: string): void {
    const source = this.sources.get(id);
    if (source) {
      try { source.stop(); } catch {}
      this.sources.delete(id);
    }
  }

  setVolume(id: string, volume: number): void {
    const gain = this.gains.get(id);
    if (gain) {
      gain.gain.setTargetAtTime(volume, this.context!.currentTime, 0.1);
    }
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(volume, this.context!.currentTime, 0.1);
    }
  }

  setListenerPosition(position: [number, number, number], forward: [number, number, number], up: [number, number, number]): void {
    if (!this.context || !this.listener) return;
    this.listener.positionX.value = position[0];
    this.listener.positionY.value = position[1];
    this.listener.positionZ.value = position[2];
    this.listener.forwardX.value = forward[0];
    this.listener.forwardY.value = forward[1];
    this.listener.forwardZ.value = forward[2];
    this.listener.upX.value = up[0];
    this.listener.upY.value = up[1];
    this.listener.upZ.value = up[2];
  }

  dispose(): void {
    this.sources.forEach((s) => { try { s.stop(); } catch {} });
    this.sources.clear();
    this.gains.clear();
    this.panner.clear();
    this.buffers.clear();
    this.context?.close();
  }
}
