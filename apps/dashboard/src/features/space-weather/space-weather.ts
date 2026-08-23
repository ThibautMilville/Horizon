export const NOAA_KP_ENDPOINT =
  "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";
export const NOAA_KP_SOURCE = "https://www.spaceweather.gov/products/planetary-k-index";
export const SPACE_WEATHER_REFRESH_MS = 5 * 60_000;

export type SpaceWeatherLevel = "quiet" | "active" | "storm";

export type SpaceWeatherObservation = {
  observedAt: string;
  kp: number;
  scale: string | null;
  level: SpaceWeatherLevel;
};

function geomagneticScale(kp: number): string | null {
  if (kp < 5) {
    return null;
  }
  if (kp < 6) {
    return "G1";
  }
  if (kp < 7) {
    return "G2";
  }
  if (kp < 8) {
    return "G3";
  }
  if (kp < 9) {
    return "G4";
  }
  return "G5";
}

export function classifySpaceWeather(kp: number): SpaceWeatherLevel {
  if (kp >= 5) {
    return "storm";
  }
  if (kp >= 4) {
    return "active";
  }
  return "quiet";
}

export function formatPlanetaryKp(kp: number): string {
  return kp.toFixed(2);
}

export function parseNoaaKpResponse(value: unknown): SpaceWeatherObservation | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  if (typeof value[0] === "object" && value[0] !== null && !Array.isArray(value[0])) {
    for (let index = value.length - 1; index >= 0; index -= 1) {
      const row = value[index];
      if (!row || typeof row !== "object") {
        continue;
      }
      const record = row as Record<string, unknown>;
      const parsed = parseObservationRow(record.time_tag, record.Kp ?? record.kp);
      if (parsed) {
        return parsed;
      }
    }
    return null;
  }

  if (!Array.isArray(value[0])) {
    return null;
  }

  const header = value[0].map(String);
  const timeIndex = header.indexOf("time_tag");
  const kpIndex = header.indexOf("Kp");
  if (timeIndex < 0 || kpIndex < 0) {
    return null;
  }

  for (let index = value.length - 1; index > 0; index -= 1) {
    const row = value[index];
    if (!Array.isArray(row)) {
      continue;
    }
    const parsed = parseObservationRow(row[timeIndex], row[kpIndex]);
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

function parseObservationRow(
  observedAtRaw: unknown,
  kpRaw: unknown,
): SpaceWeatherObservation | null {
  const observedAt = String(observedAtRaw ?? "");
  if (kpRaw === null || kpRaw === undefined || (typeof kpRaw === "string" && kpRaw.trim() === "")) {
    return null;
  }

  const kp = Number(kpRaw);
  if (!observedAt || !Number.isFinite(kp) || kp < 0 || kp > 9) {
    return null;
  }

  const utcObservedAt = /(?:Z|[+-]\d{2}:?\d{2})$/.test(observedAt)
    ? observedAt
    : `${observedAt.replace(" ", "T")}Z`;
  const parsedAt = new Date(utcObservedAt);
  if (Number.isNaN(parsedAt.getTime())) {
    return null;
  }

  return {
    observedAt: parsedAt.toISOString(),
    kp,
    scale: geomagneticScale(kp),
    level: classifySpaceWeather(kp),
  };
}
