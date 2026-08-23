import {MAP_PANEL_MARGIN, mapPanelInsets} from "./map-panel-position";
import {computeSelectionGroupPixelBounds} from "./map-anchor";

export const WORLD_MAX_BOUNDS: [[number, number], [number, number]] = [
  [-85.05112878, -180],
  [85.05112878, 180],
];

export function computeFillMinZoom(width: number, tileSize = 256): number {
  const safeWidth = Math.max(width, 1);
  const needed = Math.log2(safeWidth / tileSize);
  return Math.max(0, Math.ceil(needed));
}

export const MAP_FIT_PADDING: LPadding = {
  topLeft: [56, 96],
  bottomRight: [56, 104],
};

type LPadding = {
  topLeft: [number, number];
  bottomRight: [number, number];
};

export function mapSelectionFocusKey(satelliteId: string, stationId: string): string {
  if (satelliteId) {
    return `satellite:${satelliteId}`;
  }
  if (stationId) {
    return `station:${stationId}`;
  }
  return "";
}

export type MapFocusInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export function mapSelectionFocusInsets(statusBarHeight = 0): MapFocusInsets {
  const insets = mapPanelInsets(statusBarHeight);
  return {
    top: insets.top,
    left: MAP_PANEL_MARGIN,
    bottom: insets.bottom,
    right: MAP_PANEL_MARGIN,
  };
}

export function computeMapFocusTarget(
  mapWidth: number,
  mapHeight: number,
  insets = mapSelectionFocusInsets(),
): {x: number; y: number} {
  return {
    x: insets.left + (mapWidth - insets.left - insets.right) / 2,
    y: insets.top + (mapHeight - insets.top - insets.bottom) / 2,
  };
}

export function computeSelectionGroupPanOffset(
  markerX: number,
  markerY: number,
  mapWidth: number,
  mapHeight: number,
  statusBarHeight = 0,
): {x: number; y: number} {
  const insets = mapSelectionFocusInsets(statusBarHeight);
  const group = computeSelectionGroupPixelBounds(
    markerX,
    markerY,
    mapWidth,
    mapHeight,
    undefined,
    undefined,
    statusBarHeight,
  );
  const target = computeMapFocusTarget(mapWidth, mapHeight, insets);
  return {
    x: group.centerX - target.x,
    y: group.centerY - target.y,
  };
}

export function shouldFocusMapSelection(input: {
  selectionKey: string;
  previousSelectionKey: string;
  contactPlannerOpen: boolean;
  previousContactPlannerOpen: boolean;
  following: boolean;
  focusSelection?: boolean;
}): boolean {
  if (input.focusSelection || input.following || !input.selectionKey) {
    return false;
  }

  if (input.selectionKey !== input.previousSelectionKey) {
    return true;
  }

  return input.contactPlannerOpen && !input.previousContactPlannerOpen;
}
