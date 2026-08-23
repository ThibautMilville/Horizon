import {
  ecfToLookAngles,
  eciToEcf,
  gstime,
  propagate,
  twoline2satrec,
  type Kilometer,
  type Radians,
} from "satellite.js";

const toDegrees = (radians: number) => radians * (180 / Math.PI);
const toRadians = (degrees: number) => degrees * (Math.PI / 180);

const MINIMUM_ELEVATION_DEGREES = 5;
const PASS_SCAN_STEP_MS = 60_000;
const DEFAULT_PASS_WINDOW_HOURS = 24;
const DEFAULT_PASS_LIMIT = 8;
const CONTACT_CONFLICT_WINDOW_MS = 15 * 60_000;

export type PassSatellite = {
  id: string;
  name: string;
  tle?: {line1: string; line2: string};
};

export type PassStation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status?: string | null;
};

export type ScheduledContact = {
  date: string;
  satellite_id?: string | null;
  groundStation_id?: string | null;
};

export type SatellitePass = {
  satelliteId: string;
  satelliteName: string;
  stationId: string;
  stationName: string;
  stationStatus?: string | null;
  aos: string;
  los: string;
  durationMinutes: number;
  maxElevationDegrees: number;
  conflict: boolean;
  recommended: boolean;
};

type PassOptions = {
  start?: Date;
  windowHours?: number;
  limit?: number;
  minimumElevationDegrees?: number;
};

function elevationAt(
  satrec: ReturnType<typeof twoline2satrec>,
  station: PassStation,
  at: Date,
): number | null {
  const propagated = propagate(satrec, at);
  if (typeof propagated.position === "boolean") {
    return null;
  }

  const position = eciToEcf(propagated.position, gstime(at));
  const lookAngles = ecfToLookAngles(
    {
      latitude: toRadians(station.latitude) as Radians,
      longitude: toRadians(station.longitude) as Radians,
      height: 0 as Kilometer,
    },
    position,
  );
  return toDegrees(lookAngles.elevation as Radians);
}

export function hasScheduleConflict(
  contacts: ScheduledContact[],
  satelliteId: string,
  stationId: string,
  at: Date,
): boolean {
  return contacts.some((contact) => {
    const contactAt = new Date(contact.date).getTime();
    if (
      !Number.isFinite(contactAt) ||
      Math.abs(contactAt - at.getTime()) > CONTACT_CONFLICT_WINDOW_MS
    ) {
      return false;
    }
    return contact.satellite_id === satelliteId || contact.groundStation_id === stationId;
  });
}

export function buildSatellitePasses(
  satellite: PassSatellite | undefined,
  stations: PassStation[],
  contacts: ScheduledContact[],
  options: PassOptions = {},
): SatellitePass[] {
  if (!satellite?.tle) {
    return [];
  }

  const start = options.start ?? new Date();
  const windowHours = options.windowHours ?? DEFAULT_PASS_WINDOW_HOURS;
  const limit = options.limit ?? DEFAULT_PASS_LIMIT;
  const minimumElevation = options.minimumElevationDegrees ?? MINIMUM_ELEVATION_DEGREES;
  const endMs = start.getTime() + windowHours * 60 * 60_000;
  const satrec = twoline2satrec(satellite.tle.line1, satellite.tle.line2);
  const passes: SatellitePass[] = [];

  for (const station of stations) {
    let aosMs: number | null = null;
    let maxElevation = Number.NEGATIVE_INFINITY;

    for (let atMs = start.getTime(); atMs <= endMs; atMs += PASS_SCAN_STEP_MS) {
      const elevation = elevationAt(satrec, station, new Date(atMs));
      const visible = elevation !== null && elevation >= minimumElevation;

      if (visible && aosMs === null) {
        aosMs = atMs;
        maxElevation = elevation;
      } else if (visible) {
        maxElevation = Math.max(maxElevation, elevation);
      } else if (aosMs !== null) {
        const aos = new Date(aosMs);
        const los = new Date(atMs);
        const conflict = hasScheduleConflict(contacts, satellite.id, station.id, aos);
        const stationAvailable = station.status === "Online";
        passes.push({
          satelliteId: satellite.id,
          satelliteName: satellite.name,
          stationId: station.id,
          stationName: station.name,
          stationStatus: station.status,
          aos: aos.toISOString(),
          los: los.toISOString(),
          durationMinutes: Math.max(1, Math.round((atMs - aosMs) / 60_000)),
          maxElevationDegrees: Math.max(0, Math.round(maxElevation * 10) / 10),
          conflict,
          recommended: stationAvailable && !conflict,
        });
        aosMs = null;
        maxElevation = Number.NEGATIVE_INFINITY;
      }
    }
  }

  return passes
    .sort((left, right) => {
      if (left.recommended !== right.recommended) {
        return left.recommended ? -1 : 1;
      }
      return Date.parse(left.aos) - Date.parse(right.aos);
    })
    .slice(0, limit);
}
