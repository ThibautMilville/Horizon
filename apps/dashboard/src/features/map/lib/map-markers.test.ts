import {describe, expect, it} from "vitest";

import {buildMapMarkerIconHtml, resolveMapTheme, resolveMapThemeColors} from "./map-markers";

describe("buildMapMarkerIconHtml", () => {
  it("renders satellite and station marker shells", () => {
    const satellite = buildMapMarkerIconHtml("satellite", false);
    const station = buildMapMarkerIconHtml("station", true);

    expect(satellite).toContain("horizon-map-marker-satellite");
    expect(satellite).toContain("<svg");
    expect(station).toContain("horizon-map-marker-station");
    expect(station).toContain("horizon-map-marker-selected");
  });
});

describe("resolveMapThemeColors", () => {
  it("uses orange and black only for contrast", () => {
    const colors = resolveMapThemeColors("contrast");

    expect(resolveMapTheme("contrast")).toBe("contrast");
    expect(colors.satellite).toBe("#ff6a00");
    expect(colors.station).toBe("#ff8533");
    expect(colors.track).toBe("#ff6a00");
    expect(colors.trackGlow).toBe("#000000");
    expect(colors.terminator).toBe("#000000");
  });

  it("keeps blue family colors for dark theme", () => {
    const colors = resolveMapThemeColors("dark");

    expect(colors.satellite).toBe("#3d7eff");
    expect(colors.track).toBe("#7eb6ff");
    expect(colors.trackGlow).toBe("#1b3f73");
  });
});
