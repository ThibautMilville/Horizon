import {StationListDocument, type StationListQuery} from "@/shared/graphql";
import {useStatusFilteredList} from "@/shared/hooks/useStatusFilteredList";

import {STATION_STATUS_FILTERS, type StationListRow} from "./station-format";

export function useStationList() {
  return useStatusFilteredList<StationListRow, typeof STATION_STATUS_FILTERS>({
    document: StationListDocument,
    filters: STATION_STATUS_FILTERS,
    getRows: (data) => (data as StationListQuery | undefined)?.allGroundStations,
    getStatus: (row) => row.status,
  });
}
