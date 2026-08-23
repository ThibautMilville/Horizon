import {useParams} from "react-router-dom";

import {FullPageState} from "@/shared/ui/layout/FullPageState";

import {SatelliteDetailPage} from "./SatelliteDetailPage";
import {useSatelliteDetail} from "./useSatelliteDetail";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

export function SatelliteDetailRoute() {
  const {t} = useI18n();
  const {id} = useParams();

  if (!id) {
    return (
      <FullPageState
        description={t("satellites.missingId")}
        title={t("satellites.fallbackTitle")}
      />
    );
  }

  return <SatelliteDetailRouteBody id={id} />;
}

function SatelliteDetailRouteBody({id}: {id: string}) {
  const detail = useSatelliteDetail(id);

  return (
    <SatelliteDetailPage
      id={id}
      errorMessage={detail.errorMessage}
      loading={detail.loading}
      onRetry={detail.retry}
      orbitProfile={detail.orbitProfile}
      payloads={detail.payloads}
      position={detail.position}
      satellite={detail.satellite}
      specs={detail.specs}
      tle={detail.tle}
    />
  );
}
