import {useMemo} from "react";

import {mapRelatedAssetHref} from "@/shared/lib/map-href";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {DocumentPlusIcon, MapIcon} from "@/shared/ui/actions/action-icons";
import {ButtonLink} from "@/shared/ui/actions/Button";
import {Card} from "@/shared/ui/data-display/Card";
import {
  DataTable,
  dataTableEntityLinkColumn,
  dataTableLinkActionColumn,
  type DataTableColumn,
} from "@/shared/ui/data-display/DataTable";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {FilterBar} from "@/shared/ui/forms/FilterBar";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {TextLink} from "@/shared/ui/navigation/TextLink";
import type {NamedEntity} from "@/shared/types/entities";

import {filterLabel} from "@/shared/lib/filter-counts";

import {reportTypeTone} from "@/shared/lib/status-tone";

import {REPORT_TYPE_FILTERS} from "./report-form";

type ReportListRow = {
  id: string;
  title: string;
  type?: string | null;
  date: string;
  dateLabel: string;
  Satellite?: NamedEntity | null;
  GroundStation?: NamedEntity | null;
};

type ReportListPageProps = {
  loading: boolean;
  errorMessage?: string;
  type: string;
  typeCounts: Record<string, number>;
  rows: ReportListRow[];
  onTypeChange: (type: string) => void;
  onRetry: () => void;
};

export function ReportListPage({
  loading,
  errorMessage,
  type,
  typeCounts,
  rows,
  onTypeChange,
  onRetry,
}: ReportListPageProps) {
  const {t} = useI18n();
  const columns = useMemo<DataTableColumn<ReportListRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: t("common.title"),
        filterVariant: "text",
        Cell: ({row}) => (
          <TextLink to={`/reports/${row.original.id}`}>{row.original.title}</TextLink>
        ),
      },
      {
        accessorKey: "type",
        header: t("common.type"),
        filterVariant: "select",
        Cell: ({row}) => (
          <StatusPill
            label={row.original.type ?? t("reports.other")}
            tone={reportTypeTone(row.original.type)}
          />
        ),
      },
      {
        id: "when",
        header: t("common.when"),
        accessorFn: (row) => new Date(row.date),
        filterVariant: "datetime",
        Cell: ({row}) => row.original.dateLabel,
      },
      dataTableEntityLinkColumn(
        "satellite",
        t("common.satellite"),
        (row) => row.Satellite,
        (satellite) => `/satellites/${satellite.id}`,
      ),
      dataTableEntityLinkColumn(
        "station",
        t("common.station"),
        (row) => row.GroundStation,
        (station) => `/stations/${station.id}`,
      ),
      dataTableLinkActionColumn(
        (row) => mapRelatedAssetHref(row.Satellite?.id, row.GroundStation?.id),
        {header: t("nav.map"), icon: <MapIcon />, label: t("common.mapAction")},
      ),
    ],
    [t],
  );

  return (
    <>
      <PageHeader
        action={
          <ButtonLink to="/reports/new" variant="primary">
            <DocumentPlusIcon />
            {t("reports.new")}
          </ButtonLink>
        }
        description={t("reports.description")}
        title={t("reports.title")}
      />
      <FilterBar
        aria-label={t("reports.filterAria")}
        onChange={onTypeChange}
        options={REPORT_TYPE_FILTERS.map((value) => ({
          value,
          label: filterLabel(value, t("common.all")),
          count: typeCounts[value] ?? 0,
        }))}
        value={type}
      />
      <LoadableContent
        errorMessage={errorMessage}
        errorTitle={t("reports.loadFailed")}
        loading={loading}
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <Card title={t("reports.title")}>
          <DataTable
            columns={columns}
            empty={<EmptyState message={t("reports.emptyFilter")} />}
            filterPlaceholder={t("reports.search")}
            getRowHref={(row) => `/reports/${row.id}`}
            getRowId={(row) => row.id}
            rows={rows}
          />
        </Card>
      </LoadableContent>
    </>
  );
}
