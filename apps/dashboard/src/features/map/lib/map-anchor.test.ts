import {describe, expect, it} from "vitest";

import {
  chooseMapAnchorPlacement,
  buildMapSelectionAnchor,
  computeSelectionGroupPixelBounds,
} from "./map-anchor";

describe("chooseMapAnchorPlacement", () => {
  it("prefers below when there is room", () => {
    expect(chooseMapAnchorPlacement(400, 120, 1200, 800)).toBe("below");
  });

  it("flips above near the bottom edge", () => {
    expect(chooseMapAnchorPlacement(400, 720, 1200, 800)).toBe("above");
    expect(chooseMapAnchorPlacement(400, 650, 1200, 800, undefined, undefined, 72)).toBe("above");
  });

  it("respects the status bar inset when choosing placement", () => {
    expect(chooseMapAnchorPlacement(400, 620, 1200, 800, 280, 280, 72)).toBe("above");
  });

  it("uses side placement when vertical space is tight", () => {
    expect(chooseMapAnchorPlacement(80, 90, 400, 200)).toBe("right");
    expect(chooseMapAnchorPlacement(340, 90, 400, 200)).toBe("left");
  });

  it("opens on the side when the marker hugs a horizontal edge", () => {
    expect(chooseMapAnchorPlacement(40, 300, 1200, 800)).toBe("right");
    expect(chooseMapAnchorPlacement(1160, 300, 1200, 800)).toBe("left");
  });
});

describe("computeSelectionGroupPixelBounds", () => {
  it("centers below the marker when the popover opens underneath", () => {
    const bounds = computeSelectionGroupPixelBounds(400, 300, 1200, 800);
    expect(bounds.centerY).toBeGreaterThan(300);
    expect(bounds.centerX).toBe(400);
  });

  it("centers above the marker when the popover opens above", () => {
    const bounds = computeSelectionGroupPixelBounds(400, 720, 1200, 800);
    expect(bounds.centerY).toBeLessThan(720);
  });
});

describe("buildMapSelectionAnchor", () => {
  it("builds an anchor with placement", () => {
    expect(buildMapSelectionAnchor(400, 120, 1200, 800)).toEqual({
      x: 400,
      y: 120,
      placement: "below",
    });
  });
});
