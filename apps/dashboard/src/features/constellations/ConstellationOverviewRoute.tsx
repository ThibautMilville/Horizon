import {ConstellationOverviewPage} from "./ConstellationOverviewPage";
import {useConstellationOverview} from "./useConstellationOverview";

export function ConstellationOverviewRoute() {
  const overview = useConstellationOverview();
  return <ConstellationOverviewPage {...overview} onRetry={overview.retry} />;
}
