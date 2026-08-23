import {useSatelliteList} from "./useSatelliteList";
import {SatelliteListPage} from "./SatelliteListPage";

export function SatelliteListRoute() {
  const list = useSatelliteList();

  return (
    <SatelliteListPage
      errorMessage={list.errorMessage}
      loading={list.loading}
      onRetry={list.retry}
      onStatusChange={list.setStatus}
      rows={list.rows}
      status={list.status}
      statusCounts={list.statusCounts}
    />
  );
}
