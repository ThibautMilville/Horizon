import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {ReportDetailDocument} from "@/shared/graphql";
import {compact} from "@/shared/lib/compact";
import {formatUtcDateTime} from "@/shared/lib/datetime-local";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

import {sortByDate} from "@/shared/lib/sort-by-date";

export function useReportDetail(id: string) {
  const {language} = useI18n();
  const {data, error, loading, refetch} = useQuery(ReportDetailDocument, {
    variables: {id},
  });

  const report = data?.Report ?? null;
  const comments = sortByDate(compact(data?.allComments), "asc").map((comment) => ({
    id: comment.id,
    dateLabel: formatUtcDateTime(comment.date, language),
    content: comment.content,
    author: comment.Employee?.name ?? "-",
  }));

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    report,
    dateLabel: formatUtcDateTime(report?.date, language),
    comments,
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
