export type HorizonLanguage = "en" | "fr";
export type HorizonTheme = "dark" | "light" | "contrast";
export type HorizonTextScale = "sm" | "md" | "lg";
export type HorizonMotion = "on" | "off";

export type HorizonPreferences = {
  language: HorizonLanguage;
  theme: HorizonTheme;
  textScale: HorizonTextScale;
  motion: HorizonMotion;
};

export const PREFS_STORAGE_KEY = "horizon.prefs";

export const DEFAULT_PREFERENCES: HorizonPreferences = {
  language: "en",
  theme: "dark",
  textScale: "md",
  motion: "on",
};

export function isHorizonLanguage(value: unknown): value is HorizonLanguage {
  return value === "en" || value === "fr";
}

export function isHorizonTheme(value: unknown): value is HorizonTheme {
  return value === "dark" || value === "light" || value === "contrast";
}

export function isHorizonTextScale(value: unknown): value is HorizonTextScale {
  return value === "sm" || value === "md" || value === "lg";
}

export function isHorizonMotion(value: unknown): value is HorizonMotion {
  return value === "on" || value === "off";
}

export function parsePreferences(raw: string | null): HorizonPreferences {
  if (!raw) {
    return {...DEFAULT_PREFERENCES};
  }

  try {
    const parsed = JSON.parse(raw) as Partial<HorizonPreferences>;
    return {
      language: isHorizonLanguage(parsed.language) ? parsed.language : DEFAULT_PREFERENCES.language,
      theme: isHorizonTheme(parsed.theme) ? parsed.theme : DEFAULT_PREFERENCES.theme,
      textScale: isHorizonTextScale(parsed.textScale)
        ? parsed.textScale
        : DEFAULT_PREFERENCES.textScale,
      motion: isHorizonMotion(parsed.motion) ? parsed.motion : DEFAULT_PREFERENCES.motion,
    };
  } catch {
    return {...DEFAULT_PREFERENCES};
  }
}

export function readPreferences(storage: Storage = localStorage): HorizonPreferences {
  return parsePreferences(storage.getItem(PREFS_STORAGE_KEY));
}

export function writePreferences(prefs: HorizonPreferences, storage: Storage = localStorage): void {
  storage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
}

export function applyPreferencesToDocument(
  prefs: HorizonPreferences,
  root: HTMLElement = document.documentElement,
): void {
  root.lang = prefs.language;
  root.dataset.theme = prefs.theme;
  root.dataset.textScale = prefs.textScale;
  root.dataset.motion = prefs.motion;
}
