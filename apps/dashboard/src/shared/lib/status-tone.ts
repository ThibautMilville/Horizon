export type StatusTone = "neutral" | "ok" | "warn" | "danger";

function lookupTone(value: string | null | undefined, map: Record<string, StatusTone>): StatusTone {
  if (!value) {
    return "neutral";
  }
  return map[value] ?? "neutral";
}

const STATION_STATUS_TONES: Record<string, StatusTone> = {
  Online: "ok",
  Maintenance: "warn",
  Offline: "danger",
  Error: "danger",
};

const SATELLITE_STATUS_TONES: Record<string, StatusTone> = {
  "In Orbit": "ok",
  Planned: "warn",
  Decommissioned: "danger",
};

const PAYLOAD_STATUS_TONES: Record<string, StatusTone> = {
  Active: "ok",
  Inactive: "warn",
};

const REPORT_TYPE_TONES: Record<string, StatusTone> = {
  Incident: "danger",
  Issue: "warn",
  Maintenance: "warn",
};

const CONTACT_TYPE_TONES: Record<string, StatusTone> = {
  Maintenance: "warn",
};

export const stationStatusTone = (status?: string | null) =>
  lookupTone(status, STATION_STATUS_TONES);

export const satelliteStatusTone = (status?: string | null) =>
  lookupTone(status, SATELLITE_STATUS_TONES);

export const isUnhealthySatellite = (status?: string | null) =>
  status === "Planned" || status === "Decommissioned";

export const isAttentionStation = (status?: string | null) =>
  status === "Offline" || status === "Error" || status === "Maintenance";

export const isAttentionReport = (type?: string | null) => type === "Incident" || type === "Issue";

export const payloadStatusTone = (status?: string | null) =>
  lookupTone(status, PAYLOAD_STATUS_TONES);

export const reportTypeTone = (type?: string | null) => lookupTone(type, REPORT_TYPE_TONES);

export const contactTypeTone = (type?: string | null) => lookupTone(type, CONTACT_TYPE_TONES);

export function countSatellitesInOrbit(satellites: Array<{status?: string | null}>): number {
  return satellites.filter((satellite) => satellite.status === "In Orbit").length;
}
