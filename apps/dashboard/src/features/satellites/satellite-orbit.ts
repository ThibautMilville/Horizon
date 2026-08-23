import {eciToGeodetic, gstime, propagate, twoline2satrec} from "satellite.js";

import type {TleLines} from "@/shared/lib/tle";

export type OrbitalAltitudeSample = {
  minute: number;
  altitudeKm: number;
};

export type OrbitalAltitudeSummary = {
  minKm: number;
  maxKm: number;
  periodMinutes: number;
};

const MAX_SAMPLES = 120;
const DEFAULT_ALTITUDE_STEP_MINUTES = 2;

function orbitalPeriodMinutes(satrec: ReturnType<typeof twoline2satrec>): number {
  if (!Number.isFinite(satrec.no) || satrec.no <= 0) {
    return 90;
  }

  return (2 * Math.PI) / satrec.no;
}

export function sampleOrbitalAltitudeProfile(
  tle: TleLines,
  start: Date,
  options?: {stepMinutes?: number},
): OrbitalAltitudeSample[] {
  const satrec = twoline2satrec(tle.line1, tle.line2);
  const periodMinutes = orbitalPeriodMinutes(satrec);
  const stepMinutes = options?.stepMinutes ?? DEFAULT_ALTITUDE_STEP_MINUTES;
  const steps = Math.min(MAX_SAMPLES, Math.max(2, Math.ceil(periodMinutes / stepMinutes)));
  const samples: OrbitalAltitudeSample[] = [];

  for (let index = 0; index <= steps; index += 1) {
    const minute = (index / steps) * periodMinutes;
    const time = new Date(start.getTime() + minute * 60_000);
    const eci = propagate(satrec, time);
    if (!eci.position || typeof eci.position === "boolean") {
      continue;
    }

    const geodetic = eciToGeodetic(eci.position, gstime(time));
    if (!Number.isFinite(geodetic.height)) {
      continue;
    }

    samples.push({
      minute: Math.round(minute),
      altitudeKm: geodetic.height,
    });
  }

  return samples;
}

export function summarizeOrbitalAltitude(
  samples: OrbitalAltitudeSample[],
): OrbitalAltitudeSummary | null {
  if (samples.length === 0) {
    return null;
  }

  let minKm = samples[0].altitudeKm;
  let maxKm = samples[0].altitudeKm;

  for (const sample of samples) {
    minKm = Math.min(minKm, sample.altitudeKm);
    maxKm = Math.max(maxKm, sample.altitudeKm);
  }

  return {
    minKm,
    maxKm,
    periodMinutes: samples[samples.length - 1].minute,
  };
}

export function buildOrbitalAltitudeProfile(
  tle: TleLines | undefined,
  start: Date = new Date(),
): {samples: OrbitalAltitudeSample[]; summary: OrbitalAltitudeSummary} | null {
  if (!tle?.line1 || !tle?.line2) {
    return null;
  }

  try {
    const samples = sampleOrbitalAltitudeProfile(tle, start);
    const summary = summarizeOrbitalAltitude(samples);
    if (!summary || samples.length < 2) {
      return null;
    }

    return {samples, summary};
  } catch {
    return null;
  }
}
