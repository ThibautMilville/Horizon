import {describe, expect, it} from "vitest";

import {
  clampPanelPosition,
  defaultMapPanelPosition,
  isMapPanelMobileViewport,
  viewportToContainerPoint,
} from "./map-panel-position";

describe("clampPanelPosition", () => {
  it("keeps the panel inside the viewport with margins", () => {
    expect(
      clampPanelPosition({
        x: -40,
        y: 900,
        panelWidth: 360,
        panelHeight: 400,
        viewportWidth: 1200,
        viewportHeight: 800,
        margin: 14,
      }),
    ).toEqual({x: 14, y: 386});
  });
});

describe("defaultMapPanelPosition", () => {
  it("anchors right and centers vertically inside the map stage", () => {
    const panelWidth = 360;
    const containerWidth = 968;
    const position = defaultMapPanelPosition({
      panelWidth,
      panelHeight: 400,
      containerWidth,
      containerHeight: 800,
    });

    expect(position).toEqual({x: 594, y: 200});
    expect(position.x + panelWidth).toBeLessThanOrEqual(containerWidth);
  });

  it("centers in the area above the status bar", () => {
    const position = defaultMapPanelPosition({
      panelWidth: 360,
      panelHeight: 400,
      containerWidth: 968,
      containerHeight: 800,
      insets: {top: 14, bottom: 14 + 74},
    });

    expect(position.y).toBe(163);
  });

  it("clamps vertically when the panel is taller than the stage", () => {
    expect(
      defaultMapPanelPosition({
        panelWidth: 360,
        panelHeight: 900,
        containerWidth: 968,
        containerHeight: 800,
        margin: 14,
      }).y,
    ).toBe(14);
  });
});

describe("viewportToContainerPoint", () => {
  it("converts viewport coordinates into the map stage", () => {
    expect(viewportToContainerPoint(800, 120, 232, 0)).toEqual({x: 568, y: 120});
  });
});

describe("isMapPanelMobileViewport", () => {
  it("detects the mobile sheet breakpoint", () => {
    expect(isMapPanelMobileViewport(560)).toBe(true);
    expect(isMapPanelMobileViewport(561)).toBe(false);
  });
});
