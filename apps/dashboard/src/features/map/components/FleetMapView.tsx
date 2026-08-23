import {useEffect, useRef, useState} from "react";
import type L from "leaflet";

import {usePreferences} from "@/shared/preferences/PreferencesProvider";

import type {LatLng} from "@/features/map/lib/ground-track";
import type {MapBasemap} from "@/features/map/lib/map-basemap";
import type {MapAnchorPoint} from "@/features/map/lib/map-anchor";
import {
  applyFleetMapCameraAction,
  emptyFleetMapCameraMemory,
  ensureFleetMapMinZoom,
  planFleetMapCamera,
  scheduleSelectionRecenter,
  type FleetMapCameraMemory,
} from "@/features/map/lib/map-leaflet-camera";
import {
  replaceBasemapLayer,
  replaceTerminatorLayer,
  syncFleetMapOverlay,
  visibleFleetMapPoints,
} from "@/features/map/lib/map-leaflet-content";
import {mountFleetMap} from "@/features/map/lib/map-leaflet-mount";
import {publishSelectionAnchor} from "@/features/map/lib/map-leaflet-selection";
import {resolveMapThemeColors} from "@/features/map/lib/map-markers";
import {mapStatusBarInset} from "@/features/map/lib/map-panel-position";
import type {FleetMapPoint} from "@/features/map/lib/map-points";
import {resolveSelectedMapPoint} from "@/features/map/lib/map-points";
import type {MapZoomCommand} from "@/features/map/hooks/useMapLayers";

import "leaflet/dist/leaflet.css";
import "../fleet-map-leaflet.scss";

import styles from "./FleetMapView.module.scss";

type FleetMapViewProps = {
  points: FleetMapPoint[];
  center: [number, number];
  zoom: number;
  selectedSatelliteId: string;
  selectedStationId: string;
  trackSegments: LatLng[][];
  showSatellites: boolean;
  showStations: boolean;
  showTrack: boolean;
  showTerminator: boolean;
  basemap: MapBasemap;
  fitNonce: number;
  worldNonce: number;
  zoomCommand: MapZoomCommand;
  followTarget: LatLng | null;
  contactPlannerOpen?: boolean;
  fitFleet?: boolean;
  focusSelection?: boolean;
  showStatusBar?: boolean;
  statusBarHeight?: number;
  onClearFleetFit?: () => void;
  onClearFocusSelection?: () => void;
  onSelectSatellite: (id: string) => void;
  onSelectStation: (id: string) => void;
  onCursorMove: (label: string | null) => void;
  onSelectionAnchor: (anchor: MapAnchorPoint | null) => void;
  onUserPan: () => void;
};

export function FleetMapView({
  points,
  center,
  zoom,
  selectedSatelliteId,
  selectedStationId,
  trackSegments,
  showSatellites,
  showStations,
  showTrack,
  showTerminator,
  basemap,
  fitNonce,
  worldNonce,
  zoomCommand,
  followTarget,
  contactPlannerOpen = false,
  fitFleet = false,
  focusSelection = false,
  showStatusBar = true,
  statusBarHeight = 0,
  onClearFleetFit,
  onClearFocusSelection,
  onSelectSatellite,
  onSelectStation,
  onCursorMove,
  onSelectionAnchor,
  onUserPan,
}: FleetMapViewProps) {
  const {theme} = usePreferences();
  const mapColors = resolveMapThemeColors(theme);
  const [terminatorMinute, setTerminatorMinute] = useState(() => Math.floor(Date.now() / 60000));
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const terminatorRef = useRef<L.Polygon | null>(null);
  const basemapRef = useRef<L.TileLayer | null>(null);
  const selectSatelliteRef = useRef(onSelectSatellite);
  const selectStationRef = useRef(onSelectStation);
  const cursorRef = useRef(onCursorMove);
  const anchorRef = useRef(onSelectionAnchor);
  const userPanRef = useRef(onUserPan);
  const pointsRef = useRef(points);
  const trackSegmentsRef = useRef(trackSegments);
  const showSatellitesRef = useRef(showSatellites);
  const showStationsRef = useRef(showStations);
  const showTrackRef = useRef(showTrack);
  const followTargetRef = useRef(followTarget);
  const selectedSatelliteRef = useRef(selectedSatelliteId);
  const selectedStationRef = useRef(selectedStationId);
  const initialViewRef = useRef({center, zoom});
  const cameraMemoryRef = useRef<FleetMapCameraMemory>(emptyFleetMapCameraMemory());
  const lastZoomNonceRef = useRef(0);
  const statusBarHeightRef = useRef(statusBarHeight);
  const showStatusBarRef = useRef(showStatusBar);
  selectSatelliteRef.current = onSelectSatellite;
  selectStationRef.current = onSelectStation;
  cursorRef.current = onCursorMove;
  anchorRef.current = onSelectionAnchor;
  userPanRef.current = onUserPan;
  pointsRef.current = points;
  trackSegmentsRef.current = trackSegments;
  showSatellitesRef.current = showSatellites;
  showStationsRef.current = showStations;
  showTrackRef.current = showTrack;
  followTargetRef.current = followTarget;
  selectedSatelliteRef.current = selectedSatelliteId;
  selectedStationRef.current = selectedStationId;
  statusBarHeightRef.current = statusBarHeight;
  showStatusBarRef.current = showStatusBar;

  const statusBarInset = mapStatusBarInset(statusBarHeight, showStatusBar);
  const followKey = followTarget
    ? `${followTarget[0].toFixed(4)}:${followTarget[1].toFixed(4)}`
    : "";
  const trackContentKey = `${showTrack}:${trackSegments.length}`;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const mounted = mountFleetMap(containerRef.current, initialViewRef.current, {
      getPoints: () => pointsRef.current,
      getSelectedSatelliteId: () => selectedSatelliteRef.current,
      getSelectedStationId: () => selectedStationRef.current,
      getStatusBarHeight: () => statusBarHeightRef.current,
      getShowStatusBar: () => showStatusBarRef.current,
      onCursorMove: (label) => cursorRef.current(label),
      onSelectionAnchor: (anchor) => anchorRef.current(anchor),
      onUserPan: () => userPanRef.current(),
    });
    mapRef.current = mounted.map;
    layerRef.current = mounted.layer;

    return () => {
      mounted.destroy();
      mapRef.current = null;
      layerRef.current = null;
      terminatorRef.current = null;
      basemapRef.current = null;
    };
  }, []);

  useEffect(() => {
    let intervalId = 0;
    const syncMinute = () => setTerminatorMinute(Math.floor(Date.now() / 60000));
    const timeoutId = window.setTimeout(
      () => {
        syncMinute();
        intervalId = window.setInterval(syncMinute, 60000);
      },
      60000 - (Date.now() % 60000),
    );
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    basemapRef.current = replaceBasemapLayer(map, basemap, basemapRef.current);
  }, [basemap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    terminatorRef.current = replaceTerminatorLayer(map, terminatorRef.current, {
      showTerminator,
      at: new Date(terminatorMinute * 60000),
      fillColor: mapColors.terminator,
      theme,
    });
  }, [showTerminator, terminatorMinute, mapColors.terminator, theme]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || zoomCommand.nonce === lastZoomNonceRef.current || zoomCommand.delta === 0) {
      return;
    }
    lastZoomNonceRef.current = zoomCommand.nonce;
    map.setZoom(map.getZoom() + zoomCommand.delta);
  }, [zoomCommand]);

  useEffect(() => {
    if (!fitFleet) {
      cameraMemoryRef.current.fleetFitApplied = false;
    }
  }, [fitFleet]);

  useEffect(() => {
    if (!focusSelection) {
      cameraMemoryRef.current.selectionFocusApplied = false;
    }
  }, [focusSelection]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) {
      return;
    }

    syncFleetMapOverlay(layer, {
      points,
      showSatellites,
      showStations,
      showTrack,
      trackSegments,
      selectedSatelliteId,
      selectedStationId,
      colors: mapColors,
      theme,
      onSelectSatellite: (id) => selectSatelliteRef.current(id),
      onSelectStation: (id) => selectStationRef.current(id),
    });

    publishSelectionAnchor(
      map,
      points,
      selectedSatelliteId,
      selectedStationId,
      mapStatusBarInset(statusBarHeight, showStatusBar),
      anchorRef.current,
    );
  }, [
    points,
    selectedSatelliteId,
    selectedStationId,
    trackSegments,
    showSatellites,
    showStations,
    showTrack,
    showStatusBar,
    statusBarHeight,
    mapColors,
    theme,
  ]);

  const onClearFleetFitRef = useRef(onClearFleetFit);
  const onClearFocusSelectionRef = useRef(onClearFocusSelection);
  onClearFleetFitRef.current = onClearFleetFit;
  onClearFocusSelectionRef.current = onClearFocusSelection;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const currentPoints = pointsRef.current;
    const currentTracks = trackSegmentsRef.current;
    const selected = resolveSelectedMapPoint(currentPoints, selectedSatelliteId, selectedStationId);
    const visiblePoints = visibleFleetMapPoints(
      currentPoints,
      showSatellitesRef.current,
      showStationsRef.current,
    );

    const plan = planFleetMapCamera({
      memory: cameraMemoryRef.current,
      selected,
      selectedSatelliteId,
      selectedStationId,
      visiblePoints,
      trackSegments: currentTracks,
      showTrack: showTrackRef.current,
      followTarget: followTargetRef.current,
      contactPlannerOpen,
      fitFleet,
      focusSelection,
      fitNonce,
      worldNonce,
      statusBarInset,
    });
    cameraMemoryRef.current = plan.memory;

    if (plan.clearFleetFit) {
      onClearFleetFitRef.current?.();
    }

    applyFleetMapCameraAction(map, plan.action);
    ensureFleetMapMinZoom(map);
    map.invalidateSize();

    if (plan.action.kind !== "recenter") {
      if (selected) {
        publishSelectionAnchor(
          map,
          currentPoints,
          selectedSatelliteId,
          selectedStationId,
          statusBarInset,
          anchorRef.current,
        );
      }
      return;
    }

    const {point, deepLink} = plan.action;
    if (deepLink && containerRef.current) {
      delete containerRef.current.dataset.selectionRecentered;
    }

    const selectionKey = `${point.kind}:${point.id}`;
    let cancelled = false;
    const cancelFrames = scheduleSelectionRecenter({
      map,
      point,
      inset: statusBarInset,
      isCancelled: () => cancelled,
      getLiveMap: () => mapRef.current,
      onSettled: () => {
        if (cancelled) {
          return;
        }
        cameraMemoryRef.current.selectionFocusKey = selectionKey;
        cameraMemoryRef.current.statusBarInset = statusBarInset;
        const liveMap = mapRef.current;
        if (liveMap) {
          publishSelectionAnchor(
            liveMap,
            pointsRef.current,
            selectedSatelliteRef.current,
            selectedStationRef.current,
            statusBarInset,
            anchorRef.current,
          );
        }
        if (containerRef.current) {
          containerRef.current.dataset.selectionRecentered = "true";
        }
        if (deepLink) {
          cameraMemoryRef.current.selectionFocusApplied = true;
          onClearFocusSelectionRef.current?.();
        }
      },
    });

    return () => {
      cancelled = true;
      cancelFrames();
    };
  }, [
    selectedSatelliteId,
    selectedStationId,
    followKey,
    contactPlannerOpen,
    fitFleet,
    focusSelection,
    fitNonce,
    worldNonce,
    statusBarInset,
    trackContentKey,
    showTrack,
    showSatellites,
    showStations,
  ]);

  return <div className={`horizon-map ${styles.root}`} ref={containerRef} />;
}
