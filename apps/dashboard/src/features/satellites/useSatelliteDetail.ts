import {useEffect, useMemo} from "react";
import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {SatelliteDetailDocument} from "@/shared/graphql";
import {compact} from "@/shared/lib/compact";

import {buildOrbitalAltitudeProfile} from "./satellite-orbit";
import {formatDegrees} from "@/shared/lib/coordinates";

import {formatAltitudeKm, specEntries} from "./satellite-format";
import {tleLines} from "@/shared/lib/tle";

const IN_ORBIT_POLL_MS = 5000;

export function useSatelliteDetail(id: string) {
  const {data, error, loading, refetch, startPolling, stopPolling} = useQuery(
    SatelliteDetailDocument,
    {variables: {id}},
  );

  const satellite = data?.Satellite ?? null;
  const inOrbit = satellite?.status === "In Orbit";

  useEffect(() => {
    if (inOrbit) {
      startPolling(IN_ORBIT_POLL_MS);
      return () => stopPolling();
    }

    stopPolling();
  }, [inOrbit, startPolling, stopPolling]);

  const coordinates = Array.isArray(satellite?.coordinates) ? satellite.coordinates : [];
  const latitude = typeof coordinates[0] === "number" ? coordinates[0] : undefined;
  const longitude = typeof coordinates[1] === "number" ? coordinates[1] : undefined;
  const tle = useMemo(() => tleLines(satellite?.tle), [satellite?.tle]);
  const orbitProfile = useMemo(() => buildOrbitalAltitudeProfile(tle), [tle]);

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    satellite,
    position:
      latitude === undefined || longitude === undefined || typeof satellite?.altitude !== "number"
        ? undefined
        : {
            latitudeLabel: formatDegrees(latitude),
            longitudeLabel: formatDegrees(longitude),
            altitudeLabel: formatAltitudeKm(satellite.altitude),
          },
    orbitProfile,
    specs: specEntries(satellite?.specs),
    tle,
    payloads: compact(data?.allPayloads),
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
