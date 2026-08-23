import {useQuery} from "@apollo/client";
import {useMemo} from "react";

import {ConstellationOverviewDocument} from "@/shared/graphql";
import {compact} from "@/shared/lib/compact";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {buildConstellationSummaries} from "./constellation-overview";

export function useConstellationOverview() {
  const {data, error, loading, refetch} = useQuery(ConstellationOverviewDocument);
  const summaries = useMemo(
    () =>
      buildConstellationSummaries(
        compact(data?.allConstellations),
        compact(data?.allSatellites),
        compact(data?.allPayloads),
      ),
    [data],
  );

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    summaries,
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
