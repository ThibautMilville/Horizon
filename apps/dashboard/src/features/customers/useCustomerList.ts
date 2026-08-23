import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {CustomerListDocument} from "@/shared/graphql";
import {compact} from "@/shared/lib/compact";

export function useCustomerList() {
  const {data, error, loading, refetch} = useQuery(CustomerListDocument);

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    rows: compact(data?.allCustomers),
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
