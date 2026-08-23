import {usePayloadList} from "./usePayloadList";
import {PayloadListPage} from "./PayloadListPage";

export function PayloadListRoute() {
  const list = usePayloadList();

  return (
    <PayloadListPage
      customerId={list.customerId}
      customers={list.customers}
      errorMessage={list.errorMessage}
      loading={list.loading}
      onCustomerChange={list.setCustomerId}
      onRetry={list.retry}
      onSatelliteChange={list.setSatelliteId}
      onStatusChange={list.setStatus}
      rows={list.rows}
      satelliteId={list.satelliteId}
      satellites={list.satellites}
      status={list.status}
      statusCounts={list.statusCounts}
    />
  );
}
