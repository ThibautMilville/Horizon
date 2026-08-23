import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {CustomerDetailDocument} from "@/shared/graphql";
import {compact} from "@/shared/lib/compact";

export function useCustomerDetail(id: string) {
  const {data, error, loading, refetch} = useQuery(CustomerDetailDocument, {
    variables: {id},
  });

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    customer: data?.Customer ?? null,
    payloads: compact(data?.allPayloads),
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
