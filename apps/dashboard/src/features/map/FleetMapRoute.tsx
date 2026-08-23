import {useFleetMapScreen} from "./hooks/useFleetMapScreen";
import {FleetMapPage} from "./components/FleetMapPage";

export function FleetMapRoute() {
  return <FleetMapPage {...useFleetMapScreen()} />;
}
