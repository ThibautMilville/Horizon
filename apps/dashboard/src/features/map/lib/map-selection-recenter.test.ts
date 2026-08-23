import {describe, expect, it} from "vitest";

import {computeSelectionGroupPixelBounds} from "./map-anchor";
import {
  computeMapFocusTarget,
  computeSelectionGroupPanOffset,
  mapSelectionFocusInsets,
} from "./map-viewport";

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;
const STATUS_BAR_HEIGHT = 72;

function projectedGroupCenter(
  markerX: number,
  markerY: number,
  statusBarHeight = STATUS_BAR_HEIGHT,
): {x: number; y: number} {
  const offset = computeSelectionGroupPanOffset(
    markerX,
    markerY,
    MAP_WIDTH,
    MAP_HEIGHT,
    statusBarHeight,
  );
  const group = computeSelectionGroupPixelBounds(
    markerX,
    markerY,
    MAP_WIDTH,
    MAP_HEIGHT,
    undefined,
    undefined,
    statusBarHeight,
  );
  return {
    x: group.centerX - offset.x,
    y: group.centerY - offset.y,
  };
}

describe("map selection recenter", () => {
  it("projects the marker and popover group onto the inset-aware center", () => {
    const insets = mapSelectionFocusInsets(STATUS_BAR_HEIGHT);
    const target = computeMapFocusTarget(MAP_WIDTH, MAP_HEIGHT, insets);

    for (let markerY = 80; markerY <= 720; markerY += 40) {
      const projected = projectedGroupCenter(600, markerY);
      expect(projected.y).toBeCloseTo(target.y, 0);
      expect(projected.x).toBeCloseTo(target.x, 0);
    }
  });

  it("recenters horizontally when the marker hugs an edge", () => {
    const insets = mapSelectionFocusInsets(STATUS_BAR_HEIGHT);
    const target = computeMapFocusTarget(MAP_WIDTH, MAP_HEIGHT, insets);

    const leftEdge = projectedGroupCenter(40, 320);
    const rightEdge = projectedGroupCenter(1160, 320);

    expect(leftEdge.x).toBeCloseTo(target.x, 0);
    expect(rightEdge.x).toBeCloseTo(target.x, 0);
  });
});
