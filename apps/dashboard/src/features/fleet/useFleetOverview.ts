import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {compact} from "@/shared/lib/compact";
import {FleetOverviewDocument} from "@/shared/graphql";
import {countSatellitesInOrbit} from "@/shared/lib/status-tone";

import {
  buildAttentionQueue,
  buildSatelliteReadiness,
  buildStationNetworkHealth,
  countStationsOnline,
  countUpcomingContacts,
  fleetCounts,
  metaCount,
} from "./fleet-overview";

export function useFleetOverview() {
  const {data, error, loading, refetch} = useQuery(FleetOverviewDocument);

  const satellites = compact(data?.allSatellites);
  const stations = compact(data?.allGroundStations);
  const payloads = compact(data?.allPayloads);
  const contacts = compact(data?.allContacts);
  const reports = compact(data?.allReports);
  const attention = buildAttentionQueue(satellites, stations, reports);

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    counts: fleetCounts(
      metaCount(data?._allSatellitesMeta),
      countSatellitesInOrbit(satellites),
      metaCount(data?._allGroundStationsMeta),
      countStationsOnline(stations),
      payloads.filter((payload) => payload.status === "Active").length,
      metaCount(data?._allPayloadsMeta),
      countUpcomingContacts(contacts),
      attention,
    ),
    attention,
    satelliteReadiness: buildSatelliteReadiness(satellites),
    stationNetworkHealth: buildStationNetworkHealth(stations),
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
