import {countSatellitesInOrbit} from "@/shared/lib/status-tone";

export type ConstellationSource = {
  id: string;
  name: string;
  description?: string | null;
};

export type ConstellationSatelliteSource = {
  id: string;
  name: string;
  status?: string | null;
  altitude?: number | null;
  constellation_id?: string | null;
};

export type ConstellationPayloadSource = {
  id: string;
  status?: string | null;
  satellite_id?: string | null;
};

export type ConstellationSatellite = {
  id: string;
  name: string;
  status: string;
  altitudeKm?: number;
  payloadsActive: number;
  payloadsTotal: number;
};

export type ConstellationSummary = {
  id: string;
  name: string;
  description?: string | null;
  satellites: ConstellationSatellite[];
  satellitesInOrbit: number;
  payloadsActive: number;
  payloadsTotal: number;
  readinessPercent: number;
};

export function buildConstellationSummaries(
  constellations: ConstellationSource[],
  satellites: ConstellationSatelliteSource[],
  payloads: ConstellationPayloadSource[],
): ConstellationSummary[] {
  const payloadsBySatellite = new Map<string, ConstellationPayloadSource[]>();
  for (const payload of payloads) {
    if (!payload.satellite_id) {
      continue;
    }
    const current = payloadsBySatellite.get(payload.satellite_id) ?? [];
    current.push(payload);
    payloadsBySatellite.set(payload.satellite_id, current);
  }

  return constellations.map((constellation) => {
    const members = satellites
      .filter((satellite) => satellite.constellation_id === constellation.id)
      .map((satellite) => {
        const satellitePayloads = payloadsBySatellite.get(satellite.id) ?? [];
        return {
          id: satellite.id,
          name: satellite.name,
          status: satellite.status ?? "Unknown",
          altitudeKm:
            typeof satellite.altitude === "number" && Number.isFinite(satellite.altitude)
              ? Math.round(satellite.altitude)
              : undefined,
          payloadsActive: satellitePayloads.filter((payload) => payload.status === "Active").length,
          payloadsTotal: satellitePayloads.length,
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name));
    const satellitesInOrbit = countSatellitesInOrbit(members);
    const payloadsTotal = members.reduce((total, satellite) => total + satellite.payloadsTotal, 0);
    const payloadsActive = members.reduce(
      (total, satellite) => total + satellite.payloadsActive,
      0,
    );

    return {
      id: constellation.id,
      name: constellation.name,
      description: constellation.description,
      satellites: members,
      satellitesInOrbit,
      payloadsActive,
      payloadsTotal,
      readinessPercent:
        members.length === 0 ? 0 : Math.round((satellitesInOrbit / members.length) * 100),
    };
  });
}
