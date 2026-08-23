import L from "leaflet";

import type {LatLng} from "@/features/map/lib/ground-track";
import {clampMapToWorld, recenterSelectionGroup} from "@/features/map/lib/map-leaflet-selection";
import type {FleetMapPoint} from "@/features/map/lib/map-points";
import {SATELLITE_FOLLOW_ZOOM} from "@/features/map/lib/satellite-tracking";
import {
  computeFillMinZoom,
  MAP_FIT_PADDING,
  mapSelectionFocusKey,
  shouldFocusMapSelection,
} from "@/features/map/lib/map-viewport";

export type FleetMapCameraMemory = {
  contentKey: string;
  fitNonce: number;
  worldNonce: number;
  followKey: string;
  selectionFocusKey: string;
  plannerOpen: boolean;
  didInitialFit: boolean;
  fleetFitApplied: boolean;
  selectionFocusApplied: boolean;
  statusBarInset: number;
};

export type FleetMapCameraAction =
  | {kind: "follow"; target: LatLng; followKey: string; previousFollowKey: string}
  | {kind: "fit-points"; points: Array<[number, number] | LatLng>; animate: boolean}
  | {kind: "fit-world"; animate: boolean}
  | {kind: "recenter"; point: FleetMapPoint; deepLink: boolean}
  | {kind: "none"};

export type FleetMapCameraPlan = {
  action: FleetMapCameraAction;
  memory: FleetMapCameraMemory;
  clearFleetFit: boolean;
};

export function fleetMapContentKey(
  selectedSatelliteId: string,
  trackSegmentCount: number,
  showTrack: boolean,
): string {
  return `${selectedSatelliteId}:${trackSegmentCount}:${showTrack}`;
}

export function planFleetMapCamera(input: {
  memory: FleetMapCameraMemory;
  selected?: FleetMapPoint;
  selectedSatelliteId: string;
  selectedStationId: string;
  visiblePoints: FleetMapPoint[];
  trackSegments: LatLng[][];
  showTrack: boolean;
  followTarget: LatLng | null;
  contactPlannerOpen: boolean;
  fitFleet: boolean;
  focusSelection: boolean;
  fitNonce: number;
  worldNonce: number;
  statusBarInset: number;
}): FleetMapCameraPlan {
  const contentKey = fleetMapContentKey(
    input.selectedSatelliteId,
    input.trackSegments.length,
    input.showTrack,
  );
  const following = Boolean(input.followTarget);
  const selectionKey = mapSelectionFocusKey(input.selectedSatelliteId, input.selectedStationId);
  const focus = shouldFocusMapSelection({
    selectionKey,
    previousSelectionKey: input.memory.selectionFocusKey,
    contactPlannerOpen: input.contactPlannerOpen,
    previousContactPlannerOpen: input.memory.plannerOpen,
    following,
    focusSelection: input.focusSelection,
  });

  const memory: FleetMapCameraMemory = {
    ...input.memory,
    plannerOpen: input.contactPlannerOpen,
    selectionFocusKey: selectionKey ? input.memory.selectionFocusKey : "",
  };

  const forceFit = input.fitNonce !== memory.fitNonce;
  if (forceFit) {
    memory.fitNonce = input.fitNonce;
  }

  const forceWorld = input.worldNonce !== memory.worldNonce;
  if (forceWorld) {
    memory.worldNonce = input.worldNonce;
  }

  const markSettled = () => {
    memory.contentKey = contentKey;
    memory.didInitialFit = true;
  };

  if (following && input.followTarget) {
    const followKey = `${input.followTarget[0].toFixed(4)}:${input.followTarget[1].toFixed(4)}`;
    markSettled();
    if (followKey === memory.followKey) {
      return {action: {kind: "none"}, memory, clearFleetFit: false};
    }
    const previousFollowKey = memory.followKey;
    memory.followKey = followKey;
    return {
      action: {kind: "follow", target: input.followTarget, followKey, previousFollowKey},
      memory,
      clearFleetFit: false,
    };
  }

  memory.followKey = "";

  if (input.fitFleet && input.selected && !memory.fleetFitApplied) {
    memory.fleetFitApplied = true;
    markSettled();
    if (input.visiblePoints.length > 0) {
      return {
        action: {
          kind: "fit-points",
          points: input.visiblePoints.map((point) => [point.latitude, point.longitude]),
          animate: true,
        },
        memory,
        clearFleetFit: true,
      };
    }
    return {action: {kind: "fit-world", animate: true}, memory, clearFleetFit: true};
  }

  if (input.focusSelection && input.selected && !memory.selectionFocusApplied) {
    markSettled();
    return {
      action: {kind: "recenter", point: input.selected, deepLink: true},
      memory,
      clearFleetFit: false,
    };
  }

  if (focus && input.selected) {
    markSettled();
    return {
      action: {kind: "recenter", point: input.selected, deepLink: false},
      memory,
      clearFleetFit: false,
    };
  }

  if (
    input.selected &&
    input.statusBarInset > 0 &&
    input.statusBarInset !== memory.statusBarInset &&
    memory.selectionFocusApplied
  ) {
    memory.contentKey = contentKey;
    return {
      action: {kind: "recenter", point: input.selected, deepLink: false},
      memory,
      clearFleetFit: false,
    };
  }

  if (forceWorld) {
    markSettled();
    return {action: {kind: "fit-world", animate: true}, memory, clearFleetFit: false};
  }

  if (forceFit) {
    markSettled();
    if (input.showTrack && input.trackSegments.length > 0) {
      return {
        action: {kind: "fit-points", points: input.trackSegments.flat(), animate: true},
        memory,
        clearFleetFit: false,
      };
    }
    if (input.visiblePoints.length > 0) {
      return {
        action: {
          kind: "fit-points",
          points: input.visiblePoints.map((point) => [point.latitude, point.longitude]),
          animate: true,
        },
        memory,
        clearFleetFit: false,
      };
    }
    return {action: {kind: "fit-world", animate: true}, memory, clearFleetFit: false};
  }

  if (
    contentKey !== memory.contentKey &&
    input.showTrack &&
    input.trackSegments.length > 0 &&
    !input.selected
  ) {
    markSettled();
    return {
      action: {kind: "fit-points", points: input.trackSegments.flat(), animate: true},
      memory,
      clearFleetFit: false,
    };
  }

  if (!memory.didInitialFit) {
    markSettled();
    return {action: {kind: "fit-world", animate: false}, memory, clearFleetFit: false};
  }

  if (input.visiblePoints.length === 0 && (!input.showTrack || input.trackSegments.length === 0)) {
    memory.contentKey = "empty";
    return {action: {kind: "fit-world", animate: false}, memory, clearFleetFit: false};
  }

  return {action: {kind: "none"}, memory, clearFleetFit: false};
}

export function ensureFleetMapMinZoom(map: L.Map) {
  const size = map.getSize();
  const minZoom = computeFillMinZoom(size.x);
  map.setMinZoom(minZoom);
  if (map.getZoom() < minZoom) {
    map.setZoom(minZoom);
  }
  return minZoom;
}

export function fitMapToLatLngs(
  map: L.Map,
  latLngs: Array<[number, number] | LatLng>,
  animate = true,
) {
  if (latLngs.length === 0) {
    return;
  }

  const minZoom = ensureFleetMapMinZoom(map);
  const bounds = L.latLngBounds(latLngs);
  map.fitBounds(bounds, {
    paddingTopLeft: MAP_FIT_PADDING.topLeft,
    paddingBottomRight: MAP_FIT_PADDING.bottomRight,
    maxZoom: Math.max(minZoom, 4),
    animate,
  });

  if (map.getZoom() < minZoom) {
    map.setZoom(minZoom);
  }
  clampMapToWorld(map);
}

export function fitMapToWorld(map: L.Map, animate = true) {
  const minZoom = ensureFleetMapMinZoom(map);
  map.setView([0, 0], minZoom, {animate});
  clampMapToWorld(map);
}

export function applyFleetMapFollow(
  map: L.Map,
  target: LatLng,
  previousFollowKey: string,
  nextFollowKey: string,
) {
  const minZoom = ensureFleetMapMinZoom(map);
  const targetZoom = Math.max(minZoom, SATELLITE_FOLLOW_ZOOM);
  const firstFollow = previousFollowKey === "";
  if (firstFollow || map.getZoom() < targetZoom) {
    map.setView(target, targetZoom, {animate: true});
  } else {
    map.panTo(target, {animate: true});
  }
  clampMapToWorld(map);
  return nextFollowKey;
}

export function applyFleetMapCameraAction(map: L.Map, action: FleetMapCameraAction) {
  switch (action.kind) {
    case "follow":
      applyFleetMapFollow(map, action.target, action.previousFollowKey, action.followKey);
      return;
    case "fit-points":
      fitMapToLatLngs(map, action.points, action.animate);
      return;
    case "fit-world":
      fitMapToWorld(map, action.animate);
      return;
    case "recenter":
    case "none":
      return;
  }
}

export function scheduleSelectionRecenter(input: {
  map: L.Map;
  point: FleetMapPoint;
  inset: number;
  onSettled: () => void;
  isCancelled: () => boolean;
  getLiveMap: () => L.Map | null;
}): () => void {
  let frame = 0;

  frame = requestAnimationFrame(() => {
    if (input.isCancelled()) {
      return;
    }

    const liveMap = input.getLiveMap() ?? input.map;
    recenterSelectionGroup(liveMap, input.point, input.inset, () => {
      if (input.isCancelled()) {
        return;
      }
      input.onSettled();
    });
  });

  return () => {
    cancelAnimationFrame(frame);
  };
}

export function emptyFleetMapCameraMemory(): FleetMapCameraMemory {
  return {
    contentKey: "",
    fitNonce: 0,
    worldNonce: 0,
    followKey: "",
    selectionFocusKey: "",
    plannerOpen: false,
    didInitialFit: false,
    fleetFitApplied: false,
    selectionFocusApplied: false,
    statusBarInset: 0,
  };
}
