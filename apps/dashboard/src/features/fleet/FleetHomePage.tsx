import {useMemo, type ReactNode} from "react";

import {DomainIcon} from "@/shared/ui/actions/DomainIcon";
import {mapAssetHref} from "@/shared/lib/map-href";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {AttentionIcon, MapIcon, SatelliteIcon} from "@/shared/ui/actions/action-icons";
import {ButtonLink} from "@/shared/ui/actions/Button";
import {Card} from "@/shared/ui/data-display/Card";
import {
  DataTable,
  dataTableLinkActionColumn,
  type DataTableColumn,
} from "@/shared/ui/data-display/DataTable";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatCard} from "@/shared/ui/data-display/StatCard";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {TextLink} from "@/shared/ui/navigation/TextLink";
import type {
  AttentionItem,
  FleetCounts,
  FleetReadinessDatum,
  StationNetworkDatum,
} from "./fleet-overview";
import {FleetAnalytics} from "./FleetAnalytics";
import {SpaceWeatherCard} from "@/features/space-weather/SpaceWeatherCard";

import styles from "./FleetHomePage.module.scss";

type FleetHomePageProps = {
  loading: boolean;
  errorMessage?: string;
  counts: FleetCounts;
  attention: AttentionItem[];
  satelliteReadiness: FleetReadinessDatum[];
  stationNetworkHealth: StationNetworkDatum[];
  onRetry: () => void;
};

export function FleetHomePage({
  loading,
  errorMessage,
  counts,
  attention,
  satelliteReadiness,
  stationNetworkHealth,
  onRetry,
}: FleetHomePageProps) {
  const {t} = useI18n();
  const columns = useMemo<DataTableColumn<AttentionItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("common.asset"),
        filterVariant: "text",
        Cell: ({row}) => <TextLink to={row.original.href}>{row.original.name}</TextLink>,
      },
      {
        id: "kind",
        accessorFn: (row) => t(`search.kind.${row.kind}` as const),
        header: t("common.kind"),
        filterVariant: "select",
      },
      {
        accessorKey: "reason",
        header: t("common.reason"),
        filterVariant: "select",
        Cell: ({row}) => <StatusPill label={row.original.reason} tone={row.original.tone} />,
      },
      dataTableLinkActionColumn(
        (row) => (row.kind === "report" ? undefined : mapAssetHref(row.kind, row.id)),
        {header: t("nav.map"), icon: <MapIcon />, label: t("common.mapAction")},
      ),
    ],
    [t],
  );

  const ratioTone = (part: number, total: number): "warn" | "accent" =>
    part < total ? "warn" : part > 0 ? "accent" : "warn";

  const metrics: Array<{
    id: string;
    icon: ReactNode;
    label: string;
    tone?: "warn" | "accent";
    to?: string;
    value: string | number;
  }> = [
    {
      id: "orbit",
      icon: <DomainIcon name="satellites" />,
      label: t("fleet.inOrbit"),
      tone: ratioTone(counts.satellitesInOrbit, counts.satellites),
      to: "/satellites",
      value: `${counts.satellitesInOrbit} / ${counts.satellites}`,
    },
    {
      id: "stations",
      icon: <DomainIcon name="stations" />,
      label: t("fleet.stationsOnline"),
      tone: ratioTone(counts.stationsOnline, counts.stations),
      to: "/stations",
      value: `${counts.stationsOnline} / ${counts.stations}`,
    },
    {
      id: "payloads",
      icon: <DomainIcon name="payloads" />,
      label: t("fleet.payloadsActive"),
      tone: ratioTone(counts.payloadsActive, counts.payloadsTotal),
      to: "/payloads",
      value: `${counts.payloadsActive} / ${counts.payloadsTotal}`,
    },
    {
      id: "contacts",
      icon: <DomainIcon name="contacts" />,
      label: t("fleet.contactsUpcoming"),
      to: "/contacts",
      value: counts.contactsUpcoming,
    },
    {
      id: "attention",
      icon: <AttentionIcon />,
      label: t("fleet.attention"),
      tone: counts.attention > 0 ? ("warn" as const) : ("accent" as const),
      value: counts.attention,
    },
  ];

  return (
    <>
      <PageHeader
        action={
          <ButtonLink to="/satellites" variant="primary">
            <SatelliteIcon />
            {t("nav.satellites")}
          </ButtonLink>
        }
        description={t("fleet.description")}
        title={t("fleet.title")}
      />
      <LoadableContent
        errorMessage={errorMessage}
        errorTitle={t("fleet.loadFailed")}
        loading={loading}
        loadingVariant="fleet"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <>
          <div className={styles.metrics}>
            {metrics.map((metric) => (
              <StatCard
                icon={metric.icon}
                key={metric.id}
                label={metric.label}
                tone={metric.tone}
                to={metric.to}
                value={metric.value}
              />
            ))}
          </div>
          <div className={styles.context}>
            <SpaceWeatherCard />
          </div>
          <FleetAnalytics
            satelliteReadiness={satelliteReadiness}
            stationNetworkHealth={stationNetworkHealth}
          />
          <Card title={t("fleet.attentionQueue")}>
            <DataTable
              columns={columns}
              empty={<EmptyState message={t("fleet.noAttention")} />}
              filterPlaceholder={t("fleet.searchAttention")}
              getRowHref={(row) => row.href}
              getRowId={(row) => row.id}
              rows={attention}
            />
          </Card>
        </>
      </LoadableContent>
    </>
  );
}
