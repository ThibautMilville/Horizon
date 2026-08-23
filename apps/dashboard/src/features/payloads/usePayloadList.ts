import {useQuery} from "@apollo/client";

import {PayloadListDocument} from "@/shared/graphql";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";
import {compact} from "@/shared/lib/compact";
import {countByFilterValue, filterByField} from "@/shared/lib/filter-counts";
import {useSearchParamsPatch} from "@/shared/hooks/useSearchParamsPatch";

const PAYLOAD_STATUS_FILTERS = ["", "Active", "Inactive"] as const;

export function usePayloadList() {
  const [params, patchParams] = useSearchParamsPatch({
    status: "",
    satellite: "",
    customer: "",
  });
  const statusParam = params.status;
  const status = PAYLOAD_STATUS_FILTERS.includes(
    statusParam as (typeof PAYLOAD_STATUS_FILTERS)[number],
  )
    ? statusParam
    : "";
  const satelliteId = params.satellite;
  const customerId = params.customer;

  const {data, error, loading, refetch} = useQuery(PayloadListDocument);

  const allRows = compact(data?.allPayloads);
  const ownerScoped = filterByField(
    filterByField(allRows, satelliteId, (row) => row.satellite_id),
    customerId,
    (row) => row.customer_id,
  );
  const rows = filterByField(ownerScoped, status, (row) => row.status);
  const statusCounts = countByFilterValue(ownerScoped, PAYLOAD_STATUS_FILTERS, (row) => row.status);

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    status,
    statusCounts,
    satelliteId,
    customerId,
    rows,
    satellites: compact(data?.allSatellites),
    customers: compact(data?.allCustomers),
    setStatus: (next: string) => patchParams({status: next}),
    setSatelliteId: (next: string) => patchParams({satellite: next}),
    setCustomerId: (next: string) => patchParams({customer: next}),
    retry: () => apolloRefetch(refetch),
  };
}

export {PAYLOAD_STATUS_FILTERS};
