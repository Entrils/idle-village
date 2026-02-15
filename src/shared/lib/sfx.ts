export type SfxName = "gather" | "hire" | "upgrade" | "error" | "achievement";

const SFX_ENABLED_STORAGE_KEY = "idle_village_sfx_enabled";
const MASTER_VOLUME_STORAGE_KEY = "idle_village_master_volume";
const EFFECTS_VOLUME_STORAGE_KEY = "idle_village_effects_volume";

const sfxFiles: Record<SfxName, string> = {
  gather: "/assets/sfx/gather.wav",
  hire: "/assets/sfx/hire.wav",
  upgrade: "/assets/sfx/upgrade.wav",
  error: "/assets/sfx/error.wav",
  achievement: "/assets/sfx/achievement.wav",
};

let settingsLoaded = false;
let sfxEnabled = true;
let masterVolume = 0.7;
let effectsVolume = 0.8;

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(1, Math.max(0, value));
}

function readNumberFromStorage(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = Number(raw);
    return clamp01(parsed);
  } catch {
    return fallback;
  }
}

function writeToStorage(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors
  }
}

function ensureSettingsLoaded() {
  if (settingsLoaded) return;

  if (typeof window !== "undefined") {
    try {
      const enabledRaw = window.localStorage.getItem(SFX_ENABLED_STORAGE_KEY);
      if (enabledRaw === "0") sfxEnabled = false;
      if (enabledRaw === "1") sfxEnabled = true;
    } catch {
      // Ignore storage errors
    }

    masterVolume = readNumberFromStorage(MASTER_VOLUME_STORAGE_KEY, masterVolume);
    effectsVolume = readNumberFromStorage(EFFECTS_VOLUME_STORAGE_KEY, effectsVolume);
  }

  settingsLoaded = true;
}

export function getSfxEnabled(): boolean {
  ensureSettingsLoaded();
  return sfxEnabled;
}

export function setSfxEnabled(enabled: boolean) {
  sfxEnabled = enabled;
  settingsLoaded = true;
  writeToStorage(SFX_ENABLED_STORAGE_KEY, enabled ? "1" : "0");
}

export function getMasterVolume(): number {
  ensureSettingsLoaded();
  return masterVolume;
}

export function setMasterVolume(volume: number) {
  masterVolume = clamp01(volume);
  settingsLoaded = true;
  writeToStorage(MASTER_VOLUME_STORAGE_KEY, String(masterVolume));
}

export function getEffectsVolume(): number {
  ensureSettingsLoaded();
  return effectsVolume;
}

export function setEffectsVolume(volume: number) {
  effectsVolume = clamp01(volume);
  settingsLoaded = true;
  writeToStorage(EFFECTS_VOLUME_STORAGE_KEY, String(effectsVolume));
}

export function playSfx(name: SfxName) {
  ensureSettingsLoaded();
  if (!sfxEnabled) return;

  if (typeof window === "undefined") return;

  const volume = clamp01(masterVolume * effectsVolume);
  if (volume <= 0.001) return;

  const audio = new Audio(sfxFiles[name]);
  audio.volume = volume;
  void audio.play().catch(() => {
    // Ignore autoplay/user-gesture errors
  });
}
