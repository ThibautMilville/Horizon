import {describe, expect, it} from "vitest";

import {
  computeFillMinZoom,
  computeMapFocusTarget,
  computeSelectionGroupPanOffset,
  mapSelectionFocusInsets,
  mapSelectionFocusKey,
  shouldFocusMapSelection,
} from "./map-viewport";

describe("computeFillMinZoom", () => {
  it("fills the viewport width even if height must be panned", () => {
    expect(computeFillMinZoom(256)).toBe(0);
    expect(computeFillMinZoom(512)).toBe(1);
    expect(computeFillMinZoom(1920)).toBe(3);
    expect(computeFillMinZoom(3840)).toBe(4);
  });
});

describe("mapSelectionFocusKey", () => {
  it("prefers satellite over station", () => {
    expect(mapSelectionFocusKey("sat-1", "gs-1")).toBe("satellite:sat-1");
    expect(mapSelectionFocusKey("", "gs-1")).toBe("station:gs-1");
    expect(mapSelectionFocusKey("", "")).toBe("");
  });
});

describe("computeMapFocusTarget", () => {
  it("uses inset-aware map center", () => {
    expect(computeMapFocusTarget(1200, 800)).toEqual({x: 600, y: 400});
    expect(computeMapFocusTarget(1200, 800, mapSelectionFocusInsets(72))).toEqual({
      x: 600,
      y: 364,
    });
  });
});

describe("computeSelectionGroupPanOffset", () => {
  it("pans up when the popover opens below a high marker", () => {
    const offset = computeSelectionGroupPanOffset(400, 200, 1200, 800);
    expect(offset.y).toBeLessThan(0);
  });

  it("pans down when the popover opens above a low marker", () => {
    const offset = computeSelectionGroupPanOffset(400, 720, 1200, 800);
    expect(offset.y).toBeGreaterThan(0);
  });

  it("pans horizontally when the marker hugs the right edge", () => {
    const offset = computeSelectionGroupPanOffset(1160, 320, 1200, 800);
    expect(offset.x).toBeGreaterThan(0);
  });
});

describe("shouldFocusMapSelection", () => {
  it("focuses on selection change and planner open, not while following", () => {
    expect(
      shouldFocusMapSelection({
        selectionKey: "satellite:sat-1",
        previousSelectionKey: "",
        contactPlannerOpen: false,
        previousContactPlannerOpen: false,
        following: false,
      }),
    ).toBe(true);

    expect(
      shouldFocusMapSelection({
        selectionKey: "satellite:sat-1",
        previousSelectionKey: "satellite:sat-1",
        contactPlannerOpen: true,
        previousContactPlannerOpen: false,
        following: false,
      }),
    ).toBe(true);

    expect(
      shouldFocusMapSelection({
        selectionKey: "satellite:sat-1",
        previousSelectionKey: "satellite:sat-1",
        contactPlannerOpen: true,
        previousContactPlannerOpen: true,
        following: false,
      }),
    ).toBe(false);

    expect(
      shouldFocusMapSelection({
        selectionKey: "satellite:sat-1",
        previousSelectionKey: "",
        contactPlannerOpen: false,
        previousContactPlannerOpen: false,
        following: true,
      }),
    ).toBe(false);

    expect(
      shouldFocusMapSelection({
        selectionKey: "satellite:sat-1",
        previousSelectionKey: "",
        contactPlannerOpen: false,
        previousContactPlannerOpen: false,
        following: false,
        focusSelection: true,
      }),
    ).toBe(false);
  });
});
