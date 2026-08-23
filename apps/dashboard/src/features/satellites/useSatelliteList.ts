import {SatelliteListDocument, type SatelliteListQuery} from "@/shared/graphql";
import {useStatusFilteredList} from "@/shared/hooks/useStatusFilteredList";

import {SATELLITE_STATUS_FILTERS, type SatelliteListRow} from "./satellite-format";

export function useSatelliteList() {
  return useStatusFilteredList<SatelliteListRow, typeof SATELLITE_STATUS_FILTERS>({
    document: SatelliteListDocument,
    filters: SATELLITE_STATUS_FILTERS,
    getRows: (data) => (data as SatelliteListQuery | undefined)?.allSatellites,
    getStatus: (row) => row.status,
  });
}
