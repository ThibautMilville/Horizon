import L from "leaflet";

import {formatLatLng} from "@/features/map/lib/map-format";
import {clampMapToWorld, publishSelectionAnchor} from "@/features/map/lib/map-leaflet-selection";
import {mapStatusBarInset} from "@/features/map/lib/map-panel-position";
import type {FleetMapPoint} from "@/features/map/lib/map-points";
import {computeFillMinZoom, WORLD_MAX_BOUNDS} from "@/features/map/lib/map-viewport";
import type {MapAnchorPoint} from "@/features/map/lib/map-anchor";

type MountFleetMapHandlers = {
  getPoints: () => FleetMapPoint[];
  getSelectedSatelliteId: () => string;
  getSelectedStationId: () => string;
  getStatusBarHeight: () => number;
  getShowStatusBar: () => boolean;
  onCursorMove: (label: string | null) => void;
  onSelectionAnchor: (anchor: MapAnchorPoint | null) => void;
  onUserPan: () => void;
};

export type MountedFleetMap = {
  map: L.Map;
  layer: L.LayerGroup;
  destroy: () => void;
};

export function mountFleetMap(
  container: HTMLElement,
  initialView: {center: [number, number]; zoom: number},
  handlers: MountFleetMapHandlers,
): MountedFleetMap {
  const map = L.map(container, {
    attributionControl: false,
    zoomControl: false,
    maxBounds: WORLD_MAX_BOUNDS,
    maxBoundsViscosity: 1,
    worldCopyJump: false,
    minZoom: 0,
  }).setView(initialView.center, initialView.zoom);

  L.control
    .attribution({
      position: "bottomright",
      prefix:
        '<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>',
    })
    .addTo(map);

  L.control.scale({position: "bottomleft", metric: true, imperial: false}).addTo(map);

  const layer = L.layerGroup().addTo(map);

  const publishAnchor = (target: L.Map) => {
    const inset = mapStatusBarInset(handlers.getStatusBarHeight(), handlers.getShowStatusBar());
    publishSelectionAnchor(
      target,
      handlers.getPoints(),
      handlers.getSelectedSatelliteId(),
      handlers.getSelectedStationId(),
      inset,
      handlers.onSelectionAnchor,
    );
  };

  const applyLimits = () => {
    map.invalidateSize();
    const size = map.getSize();
    const minZoom = computeFillMinZoom(size.x);
    map.setMinZoom(minZoom);
    if (map.getZoom() < minZoom) {
      map.setZoom(minZoom);
    }
    clampMapToWorld(map);
    publishAnchor(map);
  };

  applyLimits();

  const onMouseMove = (event: L.LeafletMouseEvent) => {
    handlers.onCursorMove(formatLatLng(event.latlng.lat, event.latlng.lng));
  };
  const onMouseOut = () => {
    handlers.onCursorMove(null);
  };
  const onViewChange = () => {
    publishAnchor(map);
  };
  const onDragStart = () => {
    handlers.onUserPan();
  };

  map.on("mousemove", onMouseMove);
  map.on("mouseout", onMouseOut);
  map.on("move", onViewChange);
  map.on("zoom", onViewChange);
  map.on("dragstart", onDragStart);

  const resizeObserver = new ResizeObserver(() => {
    applyLimits();
  });
  resizeObserver.observe(container);

  return {
    map,
    layer,
    destroy: () => {
      resizeObserver.disconnect();
      map.off("mousemove", onMouseMove);
      map.off("mouseout", onMouseOut);
      map.off("move", onViewChange);
      map.off("zoom", onViewChange);
      map.off("dragstart", onDragStart);
      map.remove();
      handlers.onSelectionAnchor(null);
    },
  };
}
