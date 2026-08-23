import {useStationList} from "./useStationList";
import {StationListPage} from "./StationListPage";

export function StationListRoute() {
  const list = useStationList();

  return (
    <StationListPage
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
