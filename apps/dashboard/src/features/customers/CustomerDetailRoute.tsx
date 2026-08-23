import {useParams} from "react-router-dom";

import {FullPageState} from "@/shared/ui/layout/FullPageState";

import {CustomerDetailPage} from "./CustomerDetailPage";
import {useCustomerDetail} from "./useCustomerDetail";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

export function CustomerDetailRoute() {
  const {t} = useI18n();
  const {id} = useParams();

  if (!id) {
    return (
      <FullPageState description={t("customers.missingId")} title={t("customers.fallbackTitle")} />
    );
  }

  return <CustomerDetailRouteBody id={id} />;
}

function CustomerDetailRouteBody({id}: {id: string}) {
  const detail = useCustomerDetail(id);

  return (
    <CustomerDetailPage
      customer={detail.customer}
      errorMessage={detail.errorMessage}
      loading={detail.loading}
      onRetry={detail.retry}
      payloads={detail.payloads}
    />
  );
}
