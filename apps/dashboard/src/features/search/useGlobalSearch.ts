import {useQuery} from "@apollo/client";
import {useMemo} from "react";

import {GlobalSearchDocument} from "@/shared/graphql";
import {isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {buildGlobalSearchItems} from "./global-search";

export function useGlobalSearch(enabled: boolean) {
  const {data, error, loading} = useQuery(GlobalSearchDocument, {
    fetchPolicy: "cache-first",
    skip: !enabled,
  });

  return {
    items: useMemo(() => buildGlobalSearchItems(data), [data]),
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
  };
}
