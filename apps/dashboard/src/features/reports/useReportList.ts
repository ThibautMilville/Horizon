import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {ReportListDocument} from "@/shared/graphql";
import {useSearchParamState} from "@/shared/hooks/useSearchParamState";
import {compact} from "@/shared/lib/compact";
import {countByFilterValue, filterByField} from "@/shared/lib/filter-counts";
import {formatUtcDateTime} from "@/shared/lib/datetime-local";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

import {sortByDate} from "@/shared/lib/sort-by-date";

import {REPORT_TYPE_FILTERS} from "./report-form";

export function useReportList() {
  const {language} = useI18n();
  const [type, setType] = useSearchParamState("type", REPORT_TYPE_FILTERS, "");

  const {data, error, loading, refetch} = useQuery(ReportListDocument);

  const allRows = sortByDate(compact(data?.allReports), "desc");
  const rows = filterByField(allRows, type, (row) => row.type).map((row) => ({
    ...row,
    dateLabel: formatUtcDateTime(row.date, language),
  }));
  const typeCounts = countByFilterValue(allRows, REPORT_TYPE_FILTERS, (row) => row.type);

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    type,
    typeCounts,
    rows,
    setType,
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
