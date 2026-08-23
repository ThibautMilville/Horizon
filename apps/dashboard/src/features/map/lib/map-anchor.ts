import {MAP_PANEL_MARGIN} from "./map-panel-position";

export type MapAnchorPlacement = "above" | "below" | "left" | "right";

export type MapAnchorPoint = {
  x: number;
  y: number;
  placement: MapAnchorPlacement;
};

export const MAP_POPOVER_GAP_PX = 28;
export const MAP_POPOVER_LAYOUT_GAP_PX = 32;
export const MAP_POPOVER_ESTIMATE = {
  width: 280,
  height: 280,
};
export const MAP_MARKER_HALF_PX = 14;

export function computeSelectionGroupPixelBounds(
  markerX: number,
  markerY: number,
  mapWidth: number,
  mapHeight: number,
  popoverWidth = MAP_POPOVER_ESTIMATE.width,
  popoverHeight = MAP_POPOVER_ESTIMATE.height,
  bottomInset = 0,
): {
  top: number;
  left: number;
  bottom: number;
  right: number;
  centerX: number;
  centerY: number;
} {
  const placement = chooseMapAnchorPlacement(
    markerX,
    markerY,
    mapWidth,
    mapHeight,
    popoverWidth,
    popoverHeight,
    bottomInset,
  );
  const gap = MAP_POPOVER_LAYOUT_GAP_PX;
  const markerHalf = MAP_MARKER_HALF_PX;

  let top = markerY - markerHalf;
  let bottom = markerY + markerHalf;
  let left = markerX - markerHalf;
  let right = markerX + markerHalf;

  switch (placement) {
    case "below":
      bottom = markerY + gap + popoverHeight;
      left = Math.min(left, markerX - popoverWidth / 2);
      right = Math.max(right, markerX + popoverWidth / 2);
      break;
    case "above":
      top = markerY - gap - popoverHeight;
      left = Math.min(left, markerX - popoverWidth / 2);
      right = Math.max(right, markerX + popoverWidth / 2);
      break;
    case "right":
      right = markerX + gap + popoverWidth;
      top = Math.min(top, markerY - popoverHeight / 2);
      bottom = Math.max(bottom, markerY + popoverHeight / 2);
      break;
    case "left":
      left = markerX - gap - popoverWidth;
      top = Math.min(top, markerY - popoverHeight / 2);
      bottom = Math.max(bottom, markerY + popoverHeight / 2);
      break;
  }

  return {
    top,
    left,
    bottom,
    right,
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2,
  };
}

export function chooseMapAnchorPlacement(
  x: number,
  y: number,
  width: number,
  height: number,
  popoverWidth = MAP_POPOVER_ESTIMATE.width,
  popoverHeight = MAP_POPOVER_ESTIMATE.height,
  bottomInset = 0,
  horizontalMargin = MAP_PANEL_MARGIN,
): MapAnchorPlacement {
  const gap = MAP_POPOVER_GAP_PX;
  const neededBelow = popoverHeight + gap;
  const neededAbove = popoverHeight + gap;
  const sideNeeded = popoverWidth + gap;
  const visibleHeight = Math.max(0, height - bottomInset);
  const spaceBelow = visibleHeight - y;
  const spaceAbove = y;
  const spaceRight = width - x;
  const spaceLeft = x;

  const fitsVerticalStackHorizontally =
    x - popoverWidth / 2 >= horizontalMargin && x + popoverWidth / 2 <= width - horizontalMargin;

  const huggingRightEdge = x + popoverWidth / 2 > width - horizontalMargin;
  const huggingLeftEdge = x - popoverWidth / 2 < horizontalMargin;

  if (huggingRightEdge && spaceLeft >= sideNeeded) {
    return "left";
  }
  if (huggingLeftEdge && spaceRight >= sideNeeded) {
    return "right";
  }

  const canBelow = spaceBelow >= neededBelow && fitsVerticalStackHorizontally;
  const canAbove = spaceAbove >= neededAbove && fitsVerticalStackHorizontally;

  if (canBelow) {
    return "below";
  }
  if (canAbove) {
    return "above";
  }

  if (spaceRight >= sideNeeded && spaceLeft >= sideNeeded) {
    return x > width / 2 ? "left" : "right";
  }
  if (spaceRight >= sideNeeded) {
    return "right";
  }
  if (spaceLeft >= sideNeeded) {
    return "left";
  }

  return spaceBelow >= spaceAbove ? "below" : "above";
}

export function buildMapSelectionAnchor(
  x: number,
  y: number,
  width: number,
  height: number,
  bottomInset = 0,
): MapAnchorPoint {
  return {
    x,
    y,
    placement: chooseMapAnchorPlacement(
      x,
      y,
      width,
      height,
      MAP_POPOVER_ESTIMATE.width,
      MAP_POPOVER_ESTIMATE.height,
      bottomInset,
    ),
  };
}
