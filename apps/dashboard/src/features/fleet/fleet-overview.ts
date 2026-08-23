import {partitionContacts} from "@/shared/lib/contact-schedule";
import {
  isAttentionReport,
  isAttentionStation,
  isUnhealthySatellite,
  reportTypeTone,
  satelliteStatusTone,
  stationStatusTone,
} from "@/shared/lib/status-tone";

export type FleetSatellite = {
  id: string;
  name: string;
  status?: string | null;
};

export type FleetStation = {
  id: string;
  name: string;
  status?: string | null;
  network?: string | null;
};

export type FleetPayload = {
  id: string;
  status?: string | null;
};

export type FleetContact = {
  id: string;
  date: string;
};

export type FleetReport = {
  id: string;
  title: string;
  type?: string | null;
  date?: string | null;
};

export type FleetCounts = {
  satellites: number;
  satellitesInOrbit: number;
  stations: number;
  stationsOnline: number;
  payloadsActive: number;
  payloadsTotal: number;
  contactsUpcoming: number;
  attention: number;
};

export type FleetReadinessDatum = {
  status: string;
  count: number;
};

export type StationNetworkDatum = {
  network: string;
  Online: number;
  Offline: number;
  Error: number;
  Maintenance: number;
  Unknown: number;
};

const SATELLITE_READINESS_ORDER = ["In Orbit", "Planned", "Decommissioned"] as const;

export const STATION_NETWORK_STATUSES = [
  "Online",
  "Offline",
  "Error",
  "Maintenance",
  "Unknown",
] as const;

export type AttentionKind = "satellite" | "station" | "report";

export type AttentionItem = {
  id: string;
  href: string;
  name: string;
  kind: AttentionKind;
  reason: string;
  tone: "neutral" | "ok" | "warn" | "danger";
};

export function isRecentAttentionReport(
  report: FleetReport,
  now = new Date(),
  maximumAgeDays = 30,
): boolean {
  if (!isAttentionReport(report.type) || !report.date) {
    return false;
  }
  const reportAt = new Date(report.date).getTime();
  const ageMs = now.getTime() - reportAt;
  return Number.isFinite(reportAt) && ageMs >= 0 && ageMs <= maximumAgeDays * 24 * 60 * 60_000;
}

export function metaCount(meta?: {count?: number | null} | null): number {
  return meta?.count ?? 0;
}

export function buildAttentionQueue(
  satellites: FleetSatellite[],
  stations: FleetStation[],
  reports: FleetReport[],
  now = new Date(),
): AttentionItem[] {
  const satelliteItems = satellites
    .filter((item) => isUnhealthySatellite(item.status))
    .map((item) => ({
      id: item.id,
      href: `/satellites/${item.id}`,
      name: item.name,
      kind: "satellite" as const,
      reason: item.status ?? "Unknown",
      tone: satelliteStatusTone(item.status),
    }));

  const stationItems = stations
    .filter((item) => isAttentionStation(item.status))
    .map((item) => ({
      id: item.id,
      href: `/stations/${item.id}`,
      name: item.name,
      kind: "station" as const,
      reason: item.status ?? "Unknown",
      tone: stationStatusTone(item.status),
    }));

  const reportItems = reports
    .filter((item) => isRecentAttentionReport(item, now))
    .map((item) => ({
      id: item.id,
      href: `/reports/${item.id}`,
      name: item.title,
      kind: "report" as const,
      reason: item.type ?? "Unknown",
      tone: reportTypeTone(item.type),
    }));

  return [...satelliteItems, ...stationItems, ...reportItems];
}

export function countStationsOnline(stations: FleetStation[]): number {
  return stations.filter((station) => station.status === "Online").length;
}

export function countUpcomingContacts(contacts: FleetContact[], now = new Date()): number {
  return partitionContacts(contacts, now).upcoming.length;
}

export function fleetCounts(
  satelliteTotal: number,
  satellitesInOrbit: number,
  stationTotal: number,
  stationsOnline: number,
  payloadsActive: number,
  payloadsTotal: number,
  contactsUpcoming: number,
  attention: AttentionItem[],
): FleetCounts {
  return {
    satellites: satelliteTotal,
    satellitesInOrbit,
    stations: stationTotal,
    stationsOnline,
    payloadsActive,
    payloadsTotal,
    contactsUpcoming,
    attention: attention.length,
  };
}

export function buildSatelliteReadiness(satellites: FleetSatellite[]): FleetReadinessDatum[] {
  const counts = new Map<string, number>();

  for (const satellite of satellites) {
    const status = satellite.status?.trim() || "Unknown";
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }

  const ordered = SATELLITE_READINESS_ORDER.filter((status) => counts.has(status)).map(
    (status) => ({status, count: counts.get(status) ?? 0}),
  );
  const orderSet = new Set<string>(SATELLITE_READINESS_ORDER);
  const remainder = [...counts.entries()]
    .filter(([status]) => !orderSet.has(status))
    .map(([status, count]) => ({status, count}))
    .sort((left, right) => right.count - left.count || left.status.localeCompare(right.status));

  return [...ordered, ...remainder];
}

function emptyStationNetworkRow(network: string): StationNetworkDatum {
  return {
    network,
    Online: 0,
    Offline: 0,
    Error: 0,
    Maintenance: 0,
    Unknown: 0,
  };
}

const STATION_NETWORK_STATUS: Record<string, keyof Omit<StationNetworkDatum, "network">> = {
  Online: "Online",
  Offline: "Offline",
  Error: "Error",
  Maintenance: "Maintenance",
};

export function buildStationNetworkHealth(stations: FleetStation[]): StationNetworkDatum[] {
  const networks = new Map<string, StationNetworkDatum>();

  for (const station of stations) {
    const network = station.network?.trim() || "Unknown";
    const status = station.status?.trim() || "Unknown";
    const row = networks.get(network) ?? emptyStationNetworkRow(network);
    const key = STATION_NETWORK_STATUS[status] ?? "Unknown";
    row[key] += 1;
    networks.set(network, row);
  }

  return [...networks.values()].sort((left, right) => left.network.localeCompare(right.network));
}
