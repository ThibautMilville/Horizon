import {useParams} from "react-router-dom";

import {FullPageState} from "@/shared/ui/layout/FullPageState";

import {PayloadDetailPage} from "./PayloadDetailPage";
import {usePayloadDetail} from "./usePayloadDetail";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

export function PayloadDetailRoute() {
  const {t} = useI18n();
  const {id} = useParams();

  if (!id) {
    return (
      <FullPageState description={t("payloads.missingId")} title={t("payloads.fallbackTitle")} />
    );
  }

  return <PayloadDetailRouteBody id={id} />;
}

function PayloadDetailRouteBody({id}: {id: string}) {
  const detail = usePayloadDetail(id);

  return (
    <PayloadDetailPage
      configuration={detail.configuration}
      errorMessage={detail.errorMessage}
      loading={detail.loading}
      onRetry={detail.retry}
      payload={detail.payload}
    />
  );
}
