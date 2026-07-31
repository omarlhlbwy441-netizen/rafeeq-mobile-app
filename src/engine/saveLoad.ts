"""Rafeeq Game Engine — Save/Load System (Unity PlayerPrefs + Serialization)"""
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SaveData {
  version: string;
  timestamp: number;
  playerName: string;
  playerLevel: number;
  playerXP: number;
  inventory: Record<string, number>;
  unlockedLevels: string[];
  settings: GameSettings;
  checkpoints: Record<string, CheckpointData>;
  statistics: GameStatistics;
}

export interface GameSettings {
  graphicsQuality: "low" | "medium" | "high" | "ultra";
  resolution: { width: number; height: number };
  fullscreen: boolean;
  vsync: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  sensitivity: number;
  invertY: boolean;
  language: string;
  subtitles: boolean;
}

export interface CheckpointData {
  sceneName: string;
  position: [number, number, number];
  rotation: [number, number, number];
  health: number;
  ammo: number;
  timestamp: number;
}

export interface GameStatistics {
  totalPlayTime: number;
  deaths: number;
  kills: number;
  itemsCollected: number;
  distanceTraveled: number;
  jumps: number;
  shotsFired: number;
  accuracy: number;
}

export class SaveManager {
  private static SAVE_KEY = "rafeeq_save_data";
  private static SETTINGS_KEY = "rafeeq_settings";
  private static PREFS_PREFIX = "rafeeq_pref_";

  // ===== PLAYER PREFS (Unity-like) =====
  static async setInt(key: string, value: number): Promise<void> {
    await AsyncStorage.setItem(`${this.PREFS_PREFIX}${key}`, String(value));
  }

  static async getInt(key: string, defaultValue: number = 0): Promise<number> {
    const val = await AsyncStorage.getItem(`${this.PREFS_PREFIX}${key}`);
    return val !== null ? parseInt(val, 10) : defaultValue;
  }

  static async setFloat(key: string, value: number): Promise<void> {
    await AsyncStorage.setItem(`${this.PREFS_PREFIX}${key}`, String(value));
  }

  static async getFloat(key: string, defaultValue: number = 0): Promise<number> {
    const val = await AsyncStorage.getItem(`${this.PREFS_PREFIX}${key}`);
    return val !== null ? parseFloat(val) : defaultValue;
  }

  static async setString(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(`${this.PREFS_PREFIX}${key}`, value);
  }

  static async getString(key: string, defaultValue: string = ""): Promise<string> {
    const val = await AsyncStorage.getItem(`${this.PREFS_PREFIX}${key}`);
    return val !== null ? val : defaultValue;
  }

  static async setBool(key: string, value: boolean): Promise<void> {
    await AsyncStorage.setItem(`${this.PREFS_PREFIX}${key}`, value ? "1" : "0");
  }

  static async getBool(key: string, defaultValue: boolean = false): Promise<boolean> {
    const val = await AsyncStorage.getItem(`${this.PREFS_PREFIX}${key}`);
    return val !== null ? val === "1" : defaultValue;
  }

  static async deleteKey(key: string): Promise<void> {
    await AsyncStorage.removeItem(`${this.PREFS_PREFIX}${key}`);
  }

  static async hasKey(key: string): Promise<boolean> {
    const val = await AsyncStorage.getItem(`${this.PREFS_PREFIX}${key}`);
    return val !== null;
  }

  static async deleteAll(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const prefKeys = keys.filter((k) => k.startsWith(this.PREFS_PREFIX));
    await AsyncStorage.multiRemove(prefKeys);
  }

  // ===== SAVE SLOTS =====
  static async save(slot: number = 0, data: Partial<SaveData> = {}): Promise<void> {
    const existing = await this.load(slot);
    const saveData: SaveData = {
      version: "3.2.0",
      timestamp: Date.now(),
      playerName: data.playerName ?? existing?.playerName ?? "Player",
      playerLevel: data.playerLevel ?? existing?.playerLevel ?? 1,
      playerXP: data.playerXP ?? existing?.playerXP ?? 0,
      inventory: data.inventory ?? existing?.inventory ?? {},
      unlockedLevels: data.unlockedLevels ?? existing?.unlockedLevels ?? [],
      settings: data.settings ?? existing?.settings ?? this.getDefaultSettings(),
      checkpoints: data.checkpoints ?? existing?.checkpoints ?? {},
      statistics: data.statistics ?? existing?.statistics ?? this.getDefaultStatistics(),
    };

    await AsyncStorage.setItem(`${this.SAVE_KEY}_${slot}`, JSON.stringify(saveData));
  }

  static async load(slot: number = 0): Promise<SaveData | null> {
    const data = await AsyncStorage.getItem(`${this.SAVE_KEY}_${slot}`);
    return data ? JSON.parse(data) : null;
  }

  static async deleteSave(slot: number = 0): Promise<void> {
    await AsyncStorage.removeItem(`${this.SAVE_KEY}_${slot}`);
  }

  static async getSaveInfo(slot: number = 0): Promise<{ exists: boolean; timestamp?: number; playerName?: string }> {
    const data = await this.load(slot);
    return {
      exists: data !== null,
      timestamp: data?.timestamp,
      playerName: data?.playerName,
    };
  }

  static async listSaves(): Promise<{ slot: number; info: { exists: boolean; timestamp?: number; playerName?: string } }[]> {
    const saves = [];
    for (let i = 0; i < 10; i++) {
      saves.push({ slot: i, info: await this.getSaveInfo(i) });
    }
    return saves;
  }

  // ===== SETTINGS =====
  static async saveSettings(settings: Partial<GameSettings>): Promise<void> {
    const existing = await this.loadSettings();
    const newSettings = { ...existing, ...settings };
    await AsyncStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
  }

  static async loadSettings(): Promise<GameSettings> {
    const data = await AsyncStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : this.getDefaultSettings();
  }

  private static getDefaultSettings(): GameSettings {
    return {
      graphicsQuality: "high",
      resolution: { width: 1920, height: 1080 },
      fullscreen: true,
      vsync: true,
      masterVolume: 1.0,
      musicVolume: 0.8,
      sfxVolume: 1.0,
      sensitivity: 1.0,
      invertY: false,
      language: "en",
      subtitles: true,
    };
  }

  private static getDefaultStatistics(): GameStatistics {
    return {
      totalPlayTime: 0,
      deaths: 0,
      kills: 0,
      itemsCollected: 0,
      distanceTraveled: 0,
      jumps: 0,
      shotsFired: 0,
      accuracy: 0,
    };
  }

  // ===== CLOUD SAVE (placeholder) =====
  static async cloudSave(slot: number = 0): Promise<boolean> {
    // Would integrate with backend API
    return false;
  }

  static async cloudLoad(slot: number = 0): Promise<SaveData | null> {
    // Would integrate with backend API
    return null;
  }
}
