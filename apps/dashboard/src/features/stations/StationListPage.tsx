import {useMemo} from "react";

import {mapStationHref} from "@/shared/lib/map-href";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {MapIcon} from "@/shared/ui/actions/action-icons";
import {Card} from "@/shared/ui/data-display/Card";
import {
  DataTable,
  dataTableImageColumn,
  dataTableLinkActionColumn,
  type DataTableColumn,
} from "@/shared/ui/data-display/DataTable";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {FilterBar} from "@/shared/ui/forms/FilterBar";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {TextLink} from "@/shared/ui/navigation/TextLink";

import {filterLabel} from "@/shared/lib/filter-counts";

import {stationStatusTone} from "@/shared/lib/status-tone";

import {STATION_STATUS_FILTERS, type StationListRow} from "./station-format";

type StationListPageProps = {
  loading: boolean;
  errorMessage?: string;
  status: string;
  statusCounts: Record<string, number>;
  rows: StationListRow[];
  onStatusChange: (status: string) => void;
  onRetry: () => void;
};

export function StationListPage({
  loading,
  errorMessage,
  status,
  statusCounts,
  rows,
  onStatusChange,
  onRetry,
}: StationListPageProps) {
  const {t} = useI18n();
  const columns = useMemo<DataTableColumn<StationListRow>[]>(
    () => [
      dataTableImageColumn((row) => row.image),
      {
        accessorKey: "name",
        header: t("common.name"),
        filterVariant: "text",
        Cell: ({row}) => (
          <TextLink to={`/stations/${row.original.id}`}>{row.original.name}</TextLink>
        ),
      },
      {
        accessorKey: "status",
        header: t("common.status"),
        filterVariant: "select",
        Cell: ({cell}) => (
          <StatusPill
            label={(cell.getValue<string | null>() ?? t("common.unknown")) as string}
            tone={stationStatusTone(cell.getValue<string | null>())}
          />
        ),
      },
      {accessorKey: "network", header: t("common.network"), filterVariant: "select"},
      dataTableLinkActionColumn((row) => mapStationHref(row.id), {
        header: t("nav.map"),
        icon: <MapIcon />,
        label: t("common.mapAction"),
      }),
    ],
    [t],
  );

  return (
    <>
      <PageHeader description={t("stations.description")} title={t("stations.title")} />
      <FilterBar
        aria-label={t("stations.filterAria")}
        onChange={onStatusChange}
        options={STATION_STATUS_FILTERS.map((value) => ({
          value,
          label: filterLabel(value, t("common.all")),
          count: statusCounts[value] ?? 0,
        }))}
        value={status}
      />
      <LoadableContent
        errorMessage={errorMessage}
        errorTitle={t("stations.loadFailed")}
        loading={loading}
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <Card title={t("stations.title")}>
          <DataTable
            columns={columns}
            empty={<EmptyState message={t("stations.emptyFilter")} />}
            filterPlaceholder={t("stations.search")}
            getRowHref={(row) => `/stations/${row.id}`}
            getRowId={(row) => row.id}
            rows={rows}
          />
        </Card>
      </LoadableContent>
    </>
  );
}
