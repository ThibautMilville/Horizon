import {useEffect, useMemo, useRef, useState} from "react";

import type {MessageKey} from "@/shared/i18n/messages";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import type {MapAnchorPoint} from "@/features/map/lib/map-anchor";
import type {LatLng} from "@/features/map/lib/ground-track";
import {handleMapShortcut} from "@/features/map/lib/map-shortcuts";
import type {FleetMapPoint} from "@/features/map/lib/map-points";
import {resolveSelectedMapPoint} from "@/features/map/lib/map-points";
import {isTrackingSatellite, trackingStatusHint} from "@/features/map/lib/satellite-tracking";

import {useFleetMap} from "./useFleetMap";
import {useMapContactPlanner} from "./useMapContactPlanner";
import {useMapLayers} from "./useMapLayers";
import {useMapPanelDrag} from "./useMapPanelDrag";

export type MapToolbarActions = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onToggleFocusAndTrack: () => void;
  onWorldOverview: () => void;
  onToggleSatellites: () => void;
  onToggleStations: () => void;
  onToggleTrack: () => void;
  onToggleTerminator: () => void;
  onToggleStatusBar: () => void;
  onCycleBasemap: () => void;
  onToggleContactPlanner: () => void;
  onToggleGlobalSearch: () => void;
};

type Translate = (key: MessageKey, vars?: Record<string, string>) => string;

function mapSelectionHints(
  input: {
    selectedPoint?: FleetMapPoint;
    selectedSatelliteId: string;
    selectedSatelliteName?: string;
    trackHours: number;
    trackSegments: LatLng[][];
  },
  t: Translate,
): {trackHint?: string; statusFallback: string} {
  const hasTrack = input.trackSegments.length > 0;
  const isSatellite = input.selectedPoint?.kind === "satellite";

  return {
    trackHint: !isSatellite
      ? undefined
      : hasTrack
        ? t("map.groundTrackLabel", {hours: String(input.trackHours)})
        : input.selectedSatelliteId
          ? t("map.noGroundTrack")
          : undefined,
    statusFallback:
      input.selectedSatelliteName && hasTrack
        ? t("map.groundTrackNamed", {
            hours: String(input.trackHours),
            name: input.selectedSatelliteName,
          })
        : input.selectedSatelliteId && !hasTrack
          ? t("map.noGroundTrack")
          : t("map.selectForTrack"),
  };
}

export function useFleetMapScreen() {
  const {t} = useI18n();
  const map = useFleetMap();
  const layers = useMapLayers();
  const {ensureSatellitesVisible, ensureStationsVisible} = layers;
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [trackingSatelliteId, setTrackingSatelliteId] = useState("");
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [selectionAnchor, setSelectionAnchor] = useState<MapAnchorPoint | null>(null);
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  const selectedPoint = resolveSelectedMapPoint(
    map.points,
    map.selectedSatelliteId,
    map.selectedStationId,
  );
  const tracking = isTrackingSatellite(trackingSatelliteId, map.selectedSatelliteId);
  const canFocusAndTrack = Boolean(map.selectedSatelliteId && selectedPoint?.kind === "satellite");
  const planner = useMapContactPlanner({
    selectedPoint,
    selectedSatelliteId: map.selectedSatelliteId,
    selectedStationId: map.selectedStationId,
    satellites: map.satellites,
    stations: map.stations,
  });
  const {closePlanner, open: plannerOpen, openPlanner} = planner;
  const panelDrag = useMapPanelDrag({
    open: plannerOpen,
    statusBarHeight: layers.showStatusBar && plannerOpen ? statusBarHeight : 0,
  });

  useEffect(() => {
    if (map.selectedSatelliteId) {
      ensureSatellitesVisible();
    }
    if (map.selectedStationId) {
      ensureStationsVisible();
    }
  }, [
    ensureSatellitesVisible,
    ensureStationsVisible,
    map.selectedSatelliteId,
    map.selectedStationId,
  ]);

  const {trackHint, statusFallback} = mapSelectionHints(
    {
      selectedPoint,
      selectedSatelliteId: map.selectedSatelliteId,
      selectedSatelliteName: map.selectedSatelliteName,
      trackHours: map.trackHours,
      trackSegments: map.trackSegments,
    },
    t,
  );
  const statusHint = trackingStatusHint({
    tracking,
    selectedSatelliteName: map.selectedSatelliteName,
    fallback: statusFallback,
    trackingNamed: map.selectedSatelliteName
      ? t("map.trackingNamed", {name: map.selectedSatelliteName})
      : undefined,
  });

  const followTarget = useMemo((): LatLng | null => {
    if (!tracking || selectedPoint?.kind !== "satellite") {
      return null;
    }
    return [selectedPoint.latitude, selectedPoint.longitude];
  }, [tracking, selectedPoint]);

  const selectSatellite = (id: string) => {
    if (trackingSatelliteId && trackingSatelliteId !== id) {
      setTrackingSatelliteId("");
    }
    map.setSelection({satelliteId: id, stationId: ""});
  };

  const selectStation = (id: string) => {
    setTrackingSatelliteId("");
    map.setSelection({satelliteId: "", stationId: id});
  };

  const clearSelection = () => {
    setTrackingSatelliteId("");
    map.setSelection({satelliteId: "", stationId: ""});
    setSelectionAnchor(null);
  };

  const stopFocusAndTrack = () => {
    setTrackingSatelliteId("");
  };

  const toggleFocusAndTrack = () => {
    if (tracking) {
      stopFocusAndTrack();
      return;
    }
    if (!map.selectedSatelliteId) {
      return;
    }
    layers.ensureTrackVisible();
    layers.ensureSatellitesVisible();
    setTrackingSatelliteId(map.selectedSatelliteId);
  };

  const toolbarActions: MapToolbarActions = {
    onZoomIn: () => layers.zoomIn(),
    onZoomOut: () => layers.zoomOut(),
    onFitView: () => {
      stopFocusAndTrack();
      layers.fitView();
    },
    onToggleFocusAndTrack: () => toggleFocusAndTrack(),
    onWorldOverview: () => {
      clearSelection();
      layers.ensureSatellitesVisible();
      layers.ensureStationsVisible();
      layers.ensureTerminatorVisible();
      layers.worldView();
    },
    onToggleSatellites: () => layers.toggleSatellites(),
    onToggleStations: () => layers.toggleStations(),
    onToggleTrack: () => layers.toggleTrack(),
    onToggleTerminator: () => layers.toggleTerminator(),
    onToggleStatusBar: () => layers.toggleStatusBar(),
    onCycleBasemap: () => layers.cycleBasemap(),
    onToggleContactPlanner: () => {
      if (plannerOpen) {
        closePlanner();
        return;
      }
      openPlanner();
    },
    onToggleGlobalSearch: () => setGlobalSearchOpen((open) => !open),
  };
  const toolbarActionsRef = useRef(toolbarActions);
  toolbarActionsRef.current = toolbarActions;

  const mapShortcutsEnabled = !map.loading && !map.errorMessage && map.points.length > 0;

  useEffect(() => {
    if (!mapShortcutsEnabled) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const actions = toolbarActionsRef.current;
      handleMapShortcut(event, {
        toggleGlobalSearch: actions.onToggleGlobalSearch,
        zoomIn: actions.onZoomIn,
        zoomOut: actions.onZoomOut,
        fitView: actions.onFitView,
        toggleStatusBar: actions.onToggleStatusBar,
        toggleSatellites: actions.onToggleSatellites,
        toggleStations: actions.onToggleStations,
        toggleTrack: actions.onToggleTrack,
        toggleTerminator: actions.onToggleTerminator,
        cycleBasemap: actions.onCycleBasemap,
        toggleFocusAndTrack: actions.onToggleFocusAndTrack,
        toggleContactPlanner: actions.onToggleContactPlanner,
        worldOverview: actions.onWorldOverview,
        canFocusAndTrack,
        tracking,
      });
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [canFocusAndTrack, mapShortcutsEnabled, tracking]);

  return {
    map,
    layers,
    planner,
    panelDrag,
    tracking,
    followTarget,
    cursorLabel,
    setCursorLabel,
    selectionAnchor,
    setSelectionAnchor,
    selectedPoint,
    trackHint,
    statusHint,
    selectSatellite,
    selectStation,
    clearSelection,
    toggleFocusAndTrack,
    stopFocusAndTrack,
    globalSearchOpen,
    setGlobalSearchOpen,
    canFocusAndTrack,
    plannerOpen,
    closePlanner,
    openPlanner,
    toolbarActions,
    statusBarHeight,
    setStatusBarHeight,
  };
}
