import {useQuery, type DocumentNode, type OperationVariables} from "@apollo/client";

import {useSearchParamState} from "@/shared/hooks/useSearchParamState";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";
import {countByFilterValue, filterByField} from "@/shared/lib/filter-counts";

type UseStatusFilteredListArgs<TRow, TFilters extends readonly string[]> = {
  document: DocumentNode;
  filters: TFilters;
  getRows: (data: unknown) => ReadonlyArray<TRow | null | undefined> | null | undefined;
  getStatus: (row: TRow) => string | null | undefined;
  variables?: OperationVariables;
};

export function useStatusFilteredList<TRow, const TFilters extends readonly string[]>({
  document,
  filters,
  getRows,
  getStatus,
  variables,
}: UseStatusFilteredListArgs<TRow, TFilters>) {
  const [status, setStatus] = useSearchParamState("status", filters, "");
  const {data, error, loading, refetch} = useQuery(document, {variables});

  const sourceRows = getRows(data) ?? [];
  const allRows = sourceRows.filter((row): row is TRow => row != null);
  const rows = filterByField(allRows, status, getStatus);
  const statusCounts = countByFilterValue(allRows, filters, getStatus);

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    status,
    statusCounts,
    rows,
    setStatus,
    retry: () => apolloRefetch(refetch),
  };
}
