import type L from "leaflet";
import leaflet from "leaflet";

import {buildMapSelectionAnchor, type MapAnchorPoint} from "@/features/map/lib/map-anchor";
import {normalizeMapLongitude} from "@/features/map/lib/map-format";
import type {FleetMapPoint} from "@/features/map/lib/map-points";
import {resolveSelectedMapPoint} from "@/features/map/lib/map-points";
import {computeSelectionGroupPanOffset, WORLD_MAX_BOUNDS} from "@/features/map/lib/map-viewport";

export function clampMapToWorld(map: L.Map, animate = false) {
  map.panInsideBounds(leaflet.latLngBounds(WORLD_MAX_BOUNDS), {animate});
}

export function publishSelectionAnchor(
  map: L.Map,
  points: FleetMapPoint[],
  selectedSatelliteId: string,
  selectedStationId: string,
  statusBarInset: number,
  onAnchor: (anchor: MapAnchorPoint | null) => void,
): FleetMapPoint | undefined {
  const selected = resolveSelectedMapPoint(points, selectedSatelliteId, selectedStationId);
  if (!selected) {
    onAnchor(null);
    return undefined;
  }

  const pixel = map.latLngToContainerPoint([selected.latitude, selected.longitude]);
  const size = map.getSize();
  onAnchor(buildMapSelectionAnchor(pixel.x, pixel.y, size.x, size.y, statusBarInset));
  return selected;
}

export function recenterSelectionGroup(
  map: L.Map,
  point: FleetMapPoint,
  statusBarInset: number,
  onSettled?: () => void,
) {
  const size = map.getSize();
  if (size.x <= 0 || size.y <= 0) {
    onSettled?.();
    return;
  }

  const longitude = normalizeMapLongitude(point.longitude);
  const zoom = map.getZoom();
  map.setView([point.latitude, longitude], zoom, {animate: false});

  const markerPixel = map.latLngToContainerPoint([point.latitude, longitude]);
  const offset = computeSelectionGroupPanOffset(
    markerPixel.x,
    markerPixel.y,
    size.x,
    size.y,
    statusBarInset,
  );
  if (Math.abs(offset.x) > 1 || Math.abs(offset.y) > 1) {
    map.panBy([offset.x, offset.y], {animate: false});
  }

  clampMapToWorld(map, false);
  onSettled?.();
}
