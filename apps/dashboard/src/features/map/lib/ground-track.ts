import {eciToGeodetic, gstime, propagate, twoline2satrec} from "satellite.js";

import type {TleLines} from "@/shared/lib/tle";

const toDegrees = (radians: number) => radians * (180 / Math.PI);

export type LatLng = [number, number];

export const DEFAULT_TRACK_HOURS = 6;
export const DEFAULT_STEP_MINUTES = 2;
export const GROUND_TRACK_REFRESH_MINUTES = 5;

export function groundTrackStartMs(
  timestamp: number,
  refreshMinutes: number = GROUND_TRACK_REFRESH_MINUTES,
): number {
  const intervalMs = refreshMinutes * 60_000;
  return Math.floor(timestamp / intervalMs) * intervalMs;
}

export function sampleGroundTrack(
  tle: TleLines,
  options: {
    start: Date;
    hours?: number;
    stepMinutes?: number;
  },
): LatLng[] {
  const hours = options.hours ?? DEFAULT_TRACK_HOURS;
  const stepMinutes = options.stepMinutes ?? DEFAULT_STEP_MINUTES;
  const satrec = twoline2satrec(tle.line1, tle.line2);
  const points: LatLng[] = [];
  const steps = Math.max(1, Math.floor((hours * 60) / stepMinutes));

  for (let index = 0; index <= steps; index += 1) {
    const time = new Date(options.start.getTime() + index * stepMinutes * 60_000);
    const eci = propagate(satrec, time);
    if (!eci.position || typeof eci.position === "boolean") {
      continue;
    }

    const geodetic = eciToGeodetic(eci.position, gstime(time));
    const latitude = toDegrees(geodetic.latitude);
    const longitude = toDegrees(geodetic.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      continue;
    }

    points.push([latitude, longitude]);
  }

  return points;
}

export function splitTrackAtAntimeridian(points: LatLng[]): LatLng[][] {
  if (points.length === 0) {
    return [];
  }

  const segments: LatLng[][] = [];
  let current: LatLng[] = [points[0]];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    const jump = Math.abs(point[1] - previous[1]);

    if (jump > 180) {
      segments.push(current);
      current = [point];
      continue;
    }

    current.push(point);
  }

  segments.push(current);
  return segments.filter((segment) => segment.length >= 2);
}

export function buildGroundTrackSegments(
  tle: TleLines | undefined,
  start: Date,
  hours: number = DEFAULT_TRACK_HOURS,
): LatLng[][] {
  if (!tle?.line1 || !tle?.line2) {
    return [];
  }

  try {
    return splitTrackAtAntimeridian(sampleGroundTrack(tle, {start, hours}));
  } catch {
    return [];
  }
}
