import {normalizeMapLongitude} from "./map-format";

export type FleetMapPoint = {
  id: string;
  kind: "satellite" | "station";
  name: string;
  latitude: number;
  longitude: number;
  href: string;
  status?: string | null;
};

type FleetMapAsset = {
  id: string;
  name: string;
  coordinates?: unknown;
  status?: string | null;
};

export function parseCoordinates(
  value: unknown,
): {latitude: number; longitude: number} | undefined {
  if (!Array.isArray(value) || value.length < 2) {
    return undefined;
  }

  const latitude = value[0];
  const longitude = value[1];
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return undefined;
  }

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return undefined;
  }

  return {latitude, longitude};
}

export function buildFleetMapPoints(
  satellites: FleetMapAsset[],
  stations: FleetMapAsset[],
): FleetMapPoint[] {
  const points: FleetMapPoint[] = [];

  for (const satellite of satellites) {
    const coordinates = parseCoordinates(satellite.coordinates);
    if (!coordinates) {
      continue;
    }

    points.push({
      id: satellite.id,
      kind: "satellite",
      name: satellite.name,
      latitude: coordinates.latitude,
      longitude: normalizeMapLongitude(coordinates.longitude),
      href: `/satellites/${satellite.id}`,
      status: satellite.status,
    });
  }

  for (const station of stations) {
    const coordinates = parseCoordinates(station.coordinates);
    if (!coordinates) {
      continue;
    }

    points.push({
      id: station.id,
      kind: "station",
      name: station.name,
      latitude: coordinates.latitude,
      longitude: normalizeMapLongitude(coordinates.longitude),
      href: `/stations/${station.id}`,
      status: station.status,
    });
  }

  return points;
}

export const DEFAULT_MAP_ZOOM = 2;

export function defaultMapCenter(points: FleetMapPoint[]): [number, number] {
  if (points.length === 0) {
    return [20, 0];
  }

  const latitude = points.reduce((sum, point) => sum + point.latitude, 0) / points.length;
  const longitude = points.reduce((sum, point) => sum + point.longitude, 0) / points.length;
  return [latitude, longitude];
}

export function resolveSelectedMapPoint(
  points: FleetMapPoint[],
  selectedSatelliteId: string,
  selectedStationId: string,
): FleetMapPoint | undefined {
  return (
    points.find((point) => point.kind === "satellite" && point.id === selectedSatelliteId) ??
    points.find((point) => point.kind === "station" && point.id === selectedStationId)
  );
}

export function mapPointIdSets(points: FleetMapPoint[]): {
  satelliteIds: Set<string>;
  stationIds: Set<string>;
} {
  const satelliteIds = new Set<string>();
  const stationIds = new Set<string>();

  for (const point of points) {
    if (point.kind === "satellite") {
      satelliteIds.add(point.id);
    } else {
      stationIds.add(point.id);
    }
  }

  return {satelliteIds, stationIds};
}
