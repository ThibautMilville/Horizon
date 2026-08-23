import {describe, expect, it} from "vitest";

import {
  applyPreferencesToDocument,
  DEFAULT_PREFERENCES,
  parsePreferences,
  writePreferences,
  PREFS_STORAGE_KEY,
} from "./preferences";

describe("preferences", () => {
  it("returns defaults for empty or invalid storage", () => {
    expect(parsePreferences(null)).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences("{")).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences(JSON.stringify({language: "de"}))).toEqual(DEFAULT_PREFERENCES);
  });

  it("parses valid preference payloads", () => {
    expect(
      parsePreferences(
        JSON.stringify({language: "fr", theme: "light", textScale: "lg", motion: "off"}),
      ),
    ).toEqual({language: "fr", theme: "light", textScale: "lg", motion: "off"});
  });

  it("defaults motion when missing or invalid", () => {
    expect(
      parsePreferences(JSON.stringify({language: "en", theme: "dark", textScale: "md"})),
    ).toEqual(DEFAULT_PREFERENCES);
    expect(
      parsePreferences(
        JSON.stringify({language: "en", theme: "dark", textScale: "md", motion: "reduced"}),
      ),
    ).toEqual(DEFAULT_PREFERENCES);
  });

  it("writes preferences to storage", () => {
    const store: Record<string, string> = {};
    const storage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) {
          delete store[key];
        }
      },
      key: () => null,
      length: 0,
    } as Storage;

    writePreferences({language: "fr", theme: "contrast", textScale: "sm", motion: "off"}, storage);
    expect(JSON.parse(store[PREFS_STORAGE_KEY])).toEqual({
      language: "fr",
      theme: "contrast",
      textScale: "sm",
      motion: "off",
    });
  });

  it("applies document attributes", () => {
    const root = document.createElement("html");
    applyPreferencesToDocument(
      {language: "fr", theme: "light", textScale: "lg", motion: "off"},
      root,
    );
    expect(root.lang).toBe("fr");
    expect(root.dataset.theme).toBe("light");
    expect(root.dataset.textScale).toBe("lg");
    expect(root.dataset.motion).toBe("off");
  });
});
