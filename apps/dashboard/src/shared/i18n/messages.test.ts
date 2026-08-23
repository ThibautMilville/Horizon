import {describe, expect, it} from "vitest";

import {messagesEn, messagesFr, translate, type MessageKey} from "./messages";

describe("messages", () => {
  it("translates keys and interpolates vars", () => {
    expect(translate("en", "nav.map")).toBe("Map");
    expect(translate("fr", "nav.map")).toBe("Carte");
    expect(translate("en", "login.welcome", {name: "Commander"})).toBe("Welcome back, Commander.");
  });

  it("keeps en and fr dictionaries in sync", () => {
    const enKeys = Object.keys(messagesEn).sort();
    const frKeys = Object.keys(messagesFr).sort();
    expect(frKeys).toEqual(enKeys);

    for (const key of enKeys as MessageKey[]) {
      expect(messagesEn[key].length).toBeGreaterThan(0);
      expect(messagesFr[key].length).toBeGreaterThan(0);
    }
  });
});
