import {FleetHomePage} from "./FleetHomePage";
import {useFleetOverview} from "./useFleetOverview";

export function FleetRoute() {
  const overview = useFleetOverview();

  return (
    <FleetHomePage
      attention={overview.attention}
      counts={overview.counts}
      errorMessage={overview.errorMessage}
      loading={overview.loading}
      onRetry={overview.retry}
      satelliteReadiness={overview.satelliteReadiness}
      stationNetworkHealth={overview.stationNetworkHealth}
    />
  );
}
