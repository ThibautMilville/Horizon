import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {StationDetailDocument} from "@/shared/graphql";
import {compact} from "@/shared/lib/compact";
import {formatUtcDateTime} from "@/shared/lib/datetime-local";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

import {formatStationCoordinates} from "./station-format";

export function useStationDetail(id: string) {
  const {language} = useI18n();
  const {data, error, loading, refetch} = useQuery(StationDetailDocument, {
    variables: {id},
  });

  const station = data?.GroundStation ?? null;

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    station,
    coordinatesLabel: formatStationCoordinates(station?.coordinates),
    contacts: compact(data?.allContacts).map((contact) => ({
      id: contact.id,
      dateLabel: formatUtcDateTime(contact.date, language),
      type: contact.type,
      Satellite: contact.Satellite,
    })),
    reports: compact(data?.allReports).map((report) => ({
      id: report.id,
      dateLabel: formatUtcDateTime(report.date, language),
      title: report.title,
      type: report.type,
    })),
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
