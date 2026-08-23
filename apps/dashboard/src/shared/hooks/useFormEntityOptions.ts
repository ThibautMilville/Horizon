import {useQuery} from "@apollo/client";

import {FormEntityOptionsDocument} from "@/shared/graphql";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";
import {compact} from "@/shared/lib/compact";
import {payloadsForSatellite} from "@/shared/lib/contact-schedule";

export function useFormEntityOptions(satelliteId = "") {
  const {data, error, loading, refetch} = useQuery(FormEntityOptionsDocument);

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    satellites: compact(data?.allSatellites),
    stations: compact(data?.allGroundStations),
    employees: compact(data?.allEmployees),
    payloads: payloadsForSatellite(compact(data?.allPayloads), satelliteId),
    retry: () => apolloRefetch(refetch),
  };
}
