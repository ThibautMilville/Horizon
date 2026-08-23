import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {ContactDetailDocument} from "@/shared/graphql";

export function useContactDetail(id: string) {
  const {data, error, loading, refetch} = useQuery(ContactDetailDocument, {
    variables: {id},
  });

  const contact = data?.Contact ?? null;

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    contact,
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
