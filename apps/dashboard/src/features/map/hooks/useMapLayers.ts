import {useCallback, useState} from "react";

import type {MapBasemap} from "@/features/map/lib/map-basemap";

export type MapZoomCommand = {
  nonce: number;
  delta: number;
};

function useToggle(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((current) => !current), []);
  const enable = useCallback(() => setValue(true), []);
  return {value, toggle, enable};
}

export function useMapLayers() {
  const satellites = useToggle(true);
  const stations = useToggle(true);
  const track = useToggle(true);
  const terminator = useToggle(true);
  const statusBar = useToggle(true);
  const [basemap, setBasemap] = useState<MapBasemap>("imagery");
  const [fitNonce, setFitNonce] = useState(0);
  const [worldNonce, setWorldNonce] = useState(0);
  const [zoomCommand, setZoomCommand] = useState<MapZoomCommand>({nonce: 0, delta: 0});

  const cycleBasemap = useCallback(() => {
    setBasemap((value) => (value === "imagery" ? "streets" : "imagery"));
  }, []);

  const fitView = useCallback(() => {
    setFitNonce((value) => value + 1);
  }, []);

  const worldView = useCallback(() => {
    setWorldNonce((value) => value + 1);
  }, []);

  const zoomIn = useCallback(() => {
    setZoomCommand((value) => ({nonce: value.nonce + 1, delta: 1}));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomCommand((value) => ({nonce: value.nonce + 1, delta: -1}));
  }, []);

  return {
    showSatellites: satellites.value,
    showStations: stations.value,
    showTrack: track.value,
    showTerminator: terminator.value,
    showStatusBar: statusBar.value,
    basemap,
    fitNonce,
    worldNonce,
    zoomCommand,
    toggleSatellites: satellites.toggle,
    ensureSatellitesVisible: satellites.enable,
    toggleStations: stations.toggle,
    ensureStationsVisible: stations.enable,
    toggleTrack: track.toggle,
    ensureTrackVisible: track.enable,
    toggleTerminator: terminator.toggle,
    ensureTerminatorVisible: terminator.enable,
    toggleStatusBar: statusBar.toggle,
    cycleBasemap,
    fitView,
    worldView,
    zoomIn,
    zoomOut,
  };
}
