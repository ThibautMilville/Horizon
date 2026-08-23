import {useMemo} from "react";

import {mapAssetHref} from "@/shared/lib/map-href";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Card} from "@/shared/ui/data-display/Card";
import {
  DataTable,
  dataTableLinkActionColumn,
  type DataTableColumn,
} from "@/shared/ui/data-display/DataTable";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {TextLink} from "@/shared/ui/navigation/TextLink";
import {MapIcon} from "@/shared/ui/actions/action-icons";
import {satelliteStatusTone} from "@/shared/lib/status-tone";

import type {ConstellationSatellite, ConstellationSummary} from "./constellation-overview";

import styles from "./ConstellationOverviewPage.module.scss";

type ConstellationOverviewPageProps = {
  loading: boolean;
  errorMessage?: string;
  summaries: ConstellationSummary[];
  onRetry: () => void;
};

export function ConstellationOverviewPage({
  loading,
  errorMessage,
  summaries,
  onRetry,
}: ConstellationOverviewPageProps) {
  const {t} = useI18n();
  const columns = useMemo<DataTableColumn<ConstellationSatellite>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("common.satellite"),
        Cell: ({row}) => (
          <TextLink to={`/satellites/${row.original.id}`}>{row.original.name}</TextLink>
        ),
      },
      {
        accessorKey: "status",
        header: t("common.status"),
        Cell: ({row}) => (
          <StatusPill label={row.original.status} tone={satelliteStatusTone(row.original.status)} />
        ),
      },
      {
        accessorKey: "altitudeKm",
        header: t("satellites.altitude"),
        Cell: ({row}) =>
          row.original.altitudeKm === undefined ? "-" : `${row.original.altitudeKm} km`,
      },
      {
        accessorKey: "payloadsActive",
        header: t("constellations.activePayloads"),
        Cell: ({row}) => `${row.original.payloadsActive} / ${row.original.payloadsTotal}`,
      },
      dataTableLinkActionColumn((row) => mapAssetHref("satellite", row.id), {
        header: t("nav.map"),
        icon: <MapIcon />,
        label: t("common.mapAction"),
      }),
    ],
    [t],
  );

  return (
    <>
      <PageHeader description={t("constellations.description")} title={t("constellations.title")} />
      <LoadableContent
        empty={summaries.length === 0}
        emptyMessage={t("constellations.empty")}
        errorMessage={errorMessage}
        errorTitle={t("constellations.loadFailed")}
        loading={loading}
        loadingVariant="table"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <div className={styles.grid}>
          {summaries.map((summary) => (
            <Card key={summary.id} title={summary.name}>
              <div className={styles.summary}>
                <p className={styles.description}>{summary.description}</p>
                <div className={styles.metrics}>
                  {(
                    [
                      {
                        id: "readiness",
                        label: t("constellations.readiness"),
                        value: `${summary.readinessPercent}%`,
                      },
                      {
                        id: "orbit",
                        label: t("constellations.inOrbit"),
                        value: `${summary.satellitesInOrbit} / ${summary.satellites.length}`,
                      },
                      {
                        id: "payloads",
                        label: t("constellations.activePayloads"),
                        value: `${summary.payloadsActive} / ${summary.payloadsTotal}`,
                      },
                    ] as const
                  ).map((metric) => (
                    <div className={styles.metric} key={metric.id}>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>
                <DataTable
                  columns={columns}
                  empty={<EmptyState message={t("constellations.noSatellites")} />}
                  filterPlaceholder={t("constellations.searchSatellites")}
                  getRowHref={(row) => `/satellites/${row.id}`}
                  getRowId={(row) => row.id}
                  rows={summary.satellites}
                />
              </div>
            </Card>
          ))}
        </div>
      </LoadableContent>
    </>
  );
}
