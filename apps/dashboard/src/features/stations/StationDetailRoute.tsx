import {useParams} from "react-router-dom";

import {FullPageState} from "@/shared/ui/layout/FullPageState";

import {StationDetailPage} from "./StationDetailPage";
import {useStationDetail} from "./useStationDetail";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

export function StationDetailRoute() {
  const {t} = useI18n();
  const {id} = useParams();

  if (!id) {
    return (
      <FullPageState description={t("stations.missingId")} title={t("stations.fallbackTitle")} />
    );
  }

  return <StationDetailRouteBody id={id} />;
}

function StationDetailRouteBody({id}: {id: string}) {
  const detail = useStationDetail(id);

  return (
    <StationDetailPage
      contacts={detail.contacts}
      coordinatesLabel={detail.coordinatesLabel}
      errorMessage={detail.errorMessage}
      loading={detail.loading}
      onRetry={detail.retry}
      reports={detail.reports}
      station={detail.station}
    />
  );
}
