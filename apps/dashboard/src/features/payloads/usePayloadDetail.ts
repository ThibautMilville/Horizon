import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {PayloadDetailDocument} from "@/shared/graphql";

import {configurationEntries} from "@/shared/lib/configuration";

export function usePayloadDetail(id: string) {
  const {data, error, loading, refetch} = useQuery(PayloadDetailDocument, {
    variables: {id},
  });

  const payload = data?.Payload ?? null;

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    payload,
    configuration: configurationEntries(payload?.configuration),
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
