export const MAP_PATH = "/map";

type MapAssetKind = "satellite" | "station";

type MapHrefOptions = {
  focus?: boolean;
};

function buildMapAssetQuery(kind: MapAssetKind, id: string, options?: MapHrefOptions): string {
  const params = new URLSearchParams();
  params.set(kind === "satellite" ? "satellite" : "station", id);
  if (options?.focus) {
    params.set("focus", "selection");
  }
  return params.toString();
}

function mapAssetPath(kind: MapAssetKind, id: string, options?: MapHrefOptions): string {
  return `${MAP_PATH}?${buildMapAssetQuery(kind, id, options)}`;
}

export function mapPath(search?: URLSearchParams | Record<string, string>): string {
  if (!search) {
    return MAP_PATH;
  }

  const params = search instanceof URLSearchParams ? search : new URLSearchParams(search);
  const query = params.toString();
  return query ? `${MAP_PATH}?${query}` : MAP_PATH;
}

export function mapSatelliteHref(id: string, options?: MapHrefOptions): string {
  return mapAssetPath("satellite", id, options);
}

export function mapStationHref(id: string, options?: MapHrefOptions): string {
  return mapAssetPath("station", id, options);
}

export function mapAssetHref(kind: MapAssetKind, id: string, options?: MapHrefOptions): string {
  return kind === "satellite" ? mapSatelliteHref(id, options) : mapStationHref(id, options);
}

export function mapRelatedAssetHref(
  satelliteId?: string,
  stationId?: string,
  options?: MapHrefOptions,
): string | undefined {
  if (satelliteId) {
    return mapSatelliteHref(satelliteId, options);
  }
  return stationId ? mapStationHref(stationId, options) : undefined;
}

export function buildMapShareUrl(kind: MapAssetKind, id: string): string {
  const path = mapAssetHref(kind, id, {focus: true});
  return `${window.location.origin}${path}`;
}
