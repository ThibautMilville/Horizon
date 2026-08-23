import {useQuery} from "@apollo/client";
import {useCallback, useMemo} from "react";
import {useSearchParams} from "react-router-dom";

import {FleetMapDocument} from "@/shared/graphql";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";
import {compact} from "@/shared/lib/compact";

import {
  buildGroundTrackSegments,
  DEFAULT_TRACK_HOURS,
  groundTrackStartMs,
} from "@/features/map/lib/ground-track";
import {
  buildFleetMapPoints,
  defaultMapCenter,
  DEFAULT_MAP_ZOOM,
  mapPointIdSets,
} from "@/features/map/lib/map-points";
import {
  isFleetFitMapSearch,
  isSelectionFocusMapSearch,
  updateMapSelectionParams,
} from "@/features/map/lib/map-selection";
import {SATELLITE_TRACK_POLL_MS} from "@/features/map/lib/satellite-tracking";
import {tleLines} from "@/shared/lib/tle";

export function useFleetMap() {
  const [searchParams, setSearchParams] = useSearchParams();
  const trackStart = groundTrackStartMs(Date.now());
  const selectedSatelliteId = searchParams.get("satellite") ?? "";
  const selectedStationId = searchParams.get("station") ?? "";
  const fitFleet = isFleetFitMapSearch(searchParams);
  const focusSelection = isSelectionFocusMapSearch(searchParams);

  const {data, error, loading, refetch} = useQuery(FleetMapDocument, {
    pollInterval: SATELLITE_TRACK_POLL_MS,
  });

  const satellites = useMemo(() => compact(data?.allSatellites), [data?.allSatellites]);
  const stations = useMemo(() => compact(data?.allGroundStations), [data?.allGroundStations]);
  const points = useMemo(() => buildFleetMapPoints(satellites, stations), [satellites, stations]);
  const {satelliteIds, stationIds} = useMemo(() => mapPointIdSets(points), [points]);
  const center = useMemo(() => defaultMapCenter(points), [points]);

  const selectedSatellite = useMemo(
    () => satellites.find((satellite) => satellite.id === selectedSatelliteId) ?? null,
    [satellites, selectedSatelliteId],
  );
  const selectedTle = selectedSatellite?.tle;

  const trackSegments = useMemo(() => {
    if (!selectedSatelliteId || !selectedTle) {
      return [];
    }

    return buildGroundTrackSegments(
      tleLines(selectedTle),
      new Date(trackStart),
      DEFAULT_TRACK_HOURS,
    );
  }, [selectedSatelliteId, selectedTle, trackStart]);

  const setSelection = useCallback(
    (next: {satelliteId: string; stationId: string}) => {
      setSearchParams((current) => updateMapSelectionParams(current, next), {replace: true});
    },
    [setSearchParams],
  );

  const clearFleetFit = useCallback(() => {
    if (!isFleetFitMapSearch(searchParams)) {
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.delete("fit");
    setSearchParams(next, {replace: true});
  }, [searchParams, setSearchParams]);

  const clearFocusSelection = useCallback(() => {
    if (!isSelectionFocusMapSearch(searchParams)) {
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.delete("focus");
    setSearchParams(next, {replace: true});
  }, [searchParams, setSearchParams]);

  const retry = useCallback(() => {
    apolloRefetch(refetch);
  }, [refetch]);

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    satellites,
    stations,
    points,
    satelliteIds,
    stationIds,
    center,
    zoom: DEFAULT_MAP_ZOOM,
    selectedSatelliteId,
    selectedStationId,
    selectedSatelliteName: selectedSatellite?.name,
    trackHours: DEFAULT_TRACK_HOURS,
    trackSegments,
    fitFleet,
    focusSelection,
    setSelection,
    clearFleetFit,
    clearFocusSelection,
    retry,
  };
}
