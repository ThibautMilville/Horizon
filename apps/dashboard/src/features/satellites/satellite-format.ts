import {recordEntries} from "@/shared/lib/record-entries";

export const SATELLITE_STATUS_FILTERS = ["", "In Orbit", "Planned", "Decommissioned"] as const;

export type SatelliteListRow = {
  id: string;
  name: string;
  status?: string | null;
  manufacturer?: string | null;
  busType?: string | null;
  image?: string | null;
};

export function formatAltitudeKm(value: number): string {
  return `${Math.round(value)} km`;
}

export function formatOrbitalPeriodMinutes(minutes: number): string {
  return `${Math.round(minutes)} min`;
}

export function formatSpecKey(key: string): string {
  const normalized = key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

  if (!normalized) {
    return key;
  }

  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function specEntries(specs: unknown): {key: string; value: string}[] {
  return recordEntries(specs, {
    formatKey: formatSpecKey,
    formatValue: (value) => String(value),
  });
}
