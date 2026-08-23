import {useMemo} from "react";

import {mapSatelliteHref} from "@/shared/lib/map-href";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {satelliteStatusTone} from "@/shared/lib/status-tone";
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

import {SATELLITE_STATUS_FILTERS, type SatelliteListRow} from "./satellite-format";

type SatelliteListPageProps = {
  loading: boolean;
  errorMessage?: string;
  status: string;
  statusCounts: Record<string, number>;
  rows: SatelliteListRow[];
  onStatusChange: (status: string) => void;
  onRetry: () => void;
};

export function SatelliteListPage({
  loading,
  errorMessage,
  status,
  statusCounts,
  rows,
  onStatusChange,
  onRetry,
}: SatelliteListPageProps) {
  const {t} = useI18n();
  const columns = useMemo<DataTableColumn<SatelliteListRow>[]>(
    () => [
      dataTableImageColumn((row) => row.image),
      {
        accessorKey: "name",
        header: t("common.name"),
        filterVariant: "text",
        Cell: ({row}) => (
          <TextLink to={`/satellites/${row.original.id}`}>{row.original.name}</TextLink>
        ),
      },
      {
        accessorKey: "status",
        header: t("common.status"),
        filterVariant: "select",
        Cell: ({cell}) => (
          <StatusPill
            label={(cell.getValue<string | null>() ?? t("common.unknown")) as string}
            tone={satelliteStatusTone(cell.getValue<string | null>())}
          />
        ),
      },
      {accessorKey: "manufacturer", header: t("common.manufacturer"), filterVariant: "text"},
      {accessorKey: "busType", header: t("common.bus"), filterVariant: "select"},
      dataTableLinkActionColumn((row) => mapSatelliteHref(row.id), {
        header: t("nav.map"),
        icon: <MapIcon />,
        label: t("common.mapAction"),
      }),
    ],
    [t],
  );

  return (
    <>
      <PageHeader description={t("satellites.description")} title={t("satellites.title")} />
      <FilterBar
        aria-label={t("satellites.filterAria")}
        onChange={onStatusChange}
        options={SATELLITE_STATUS_FILTERS.map((value) => ({
          value,
          label: filterLabel(value, t("common.all")),
          count: statusCounts[value] ?? 0,
        }))}
        value={status}
      />
      <LoadableContent
        errorMessage={errorMessage}
        errorTitle={t("satellites.loadFailed")}
        loading={loading}
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <Card title={t("satellites.title")}>
          <DataTable
            columns={columns}
            empty={<EmptyState message={t("satellites.emptyFilter")} />}
            filterPlaceholder={t("satellites.search")}
            getRowHref={(row) => `/satellites/${row.id}`}
            getRowId={(row) => row.id}
            rows={rows}
          />
        </Card>
      </LoadableContent>
    </>
  );
}
