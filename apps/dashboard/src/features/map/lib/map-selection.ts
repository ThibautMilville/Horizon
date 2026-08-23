export function writeMapSelectionParams(input: {
  satelliteId: string;
  stationId: string;
}): Record<string, string> {
  if (input.satelliteId) {
    return {satellite: input.satelliteId};
  }

  if (input.stationId) {
    return {station: input.stationId};
  }

  return {};
}

export function updateMapSelectionParams(
  current: URLSearchParams,
  input: {satelliteId: string; stationId: string},
): URLSearchParams {
  const next = new URLSearchParams(current);
  next.delete("satellite");
  next.delete("station");

  for (const [key, value] of Object.entries(writeMapSelectionParams(input))) {
    next.set(key, value);
  }

  return next;
}

export function isSelectionFocusMapSearch(searchParams: URLSearchParams): boolean {
  return searchParams.get("focus") === "selection";
}

export function isFleetFitMapSearch(searchParams: URLSearchParams): boolean {
  return searchParams.get("fit") === "fleet";
}

export function resolveMapSelectionIds(input: {
  selectedPoint?: {id: string; kind: "satellite" | "station"};
  selectedSatelliteId: string;
  selectedStationId: string;
}): {satelliteId: string; stationId: string} {
  return {
    satelliteId:
      input.selectedSatelliteId ||
      (input.selectedPoint?.kind === "satellite" ? input.selectedPoint.id : ""),
    stationId:
      input.selectedStationId ||
      (input.selectedPoint?.kind === "station" ? input.selectedPoint.id : ""),
  };
}
