import {formatDegrees} from "@/shared/lib/coordinates";

export const STATION_STATUS_FILTERS = [
  "",
  "Online",
  "Offline",
  "Error",
  "Maintenance",
  "Unknown",
] as const;

export type StationListRow = {
  id: string;
  name: string;
  status?: string | null;
  network?: string | null;
  image?: string | null;
};

export function formatStationCoordinates(coordinates: unknown): string {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return "-";
  }

  const latitude = coordinates[0];
  const longitude = coordinates[1];
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return "-";
  }

  return `${formatDegrees(latitude)}, ${formatDegrees(longitude)}`;
}
