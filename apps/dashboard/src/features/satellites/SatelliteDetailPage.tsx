import {useMemo} from "react";

import {mapSatelliteHref} from "@/shared/lib/map-href";
import {formatUtcDate} from "@/shared/lib/datetime-local";
import {DomainIcon} from "@/shared/ui/actions/DomainIcon";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {payloadStatusTone, satelliteStatusTone} from "@/shared/lib/status-tone";
import {ArrowLeftIcon, MapIcon} from "@/shared/ui/actions/action-icons";
import {ButtonLink} from "@/shared/ui/actions/Button";
import {Card} from "@/shared/ui/data-display/Card";
import {CoverImage} from "@/shared/ui/data-display/CoverImage";
import {DataTable, type DataTableColumn} from "@/shared/ui/data-display/DataTable";
import {DetailGrid, DetailHero, DetailStack} from "@/shared/ui/layout/DetailLayout";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {MetaList} from "@/shared/ui/data-display/MetaList";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {TextLink} from "@/shared/ui/navigation/TextLink";

import {SatelliteOrbitChart} from "./SatelliteOrbitChart";
import type {OrbitalAltitudeSample, OrbitalAltitudeSummary} from "./satellite-orbit";
import {formatAltitudeKm, formatOrbitalPeriodMinutes} from "./satellite-format";

import styles from "./SatelliteDetailPage.module.scss";

type PayloadRow = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  status?: string | null;
};

type SpecRow = {key: string; value: string};

type OrbitProfile = {
  samples: OrbitalAltitudeSample[];
  summary: OrbitalAltitudeSummary;
};

type SatelliteDetailPageProps = {
  id: string;
  loading: boolean;
  errorMessage?: string;
  satellite?: {
    id: string;
    name: string;
    description?: string | null;
    status?: string | null;
    manufacturer?: string | null;
    busType?: string | null;
    image?: string | null;
    Launch?: {
      id: string;
      date?: string | null;
      provider?: string | null;
      status?: string | null;
      outcome?: string | null;
      rocket?: string | null;
    } | null;
    Constellation?: {id: string; name: string} | null;
  } | null;
  position?: {
    latitudeLabel: string;
    longitudeLabel: string;
    altitudeLabel: string;
  };
  orbitProfile?: OrbitProfile | null;
  specs: SpecRow[];
  tle?: {line1: string; line2: string};
  payloads: PayloadRow[];
  onRetry: () => void;
};

export function SatelliteDetailPage({
  id,
  loading,
  errorMessage,
  satellite,
  position,
  orbitProfile,
  specs,
  tle,
  payloads,
  onRetry,
}: SatelliteDetailPageProps) {
  const {t, language} = useI18n();
  const specColumns = useMemo<DataTableColumn<SpecRow>[]>(
    () => [
      {accessorKey: "key", header: t("common.key")},
      {accessorKey: "value", header: t("common.value")},
    ],
    [t],
  );
  const payloadColumns = useMemo<DataTableColumn<PayloadRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("common.name"),
        Cell: ({row}) => (
          <TextLink to={`/payloads/${row.original.id}`}>{row.original.name}</TextLink>
        ),
      },
      {accessorKey: "category", header: t("common.category")},
      {
        accessorKey: "status",
        header: t("common.status"),
        Cell: ({row}) => (
          <StatusPill
            label={row.original.status ?? t("common.unknown")}
            tone={payloadStatusTone(row.original.status)}
          />
        ),
      },
      {accessorKey: "description", header: t("common.description")},
    ],
    [t],
  );
  const positionItems = useMemo(() => {
    if (!position) {
      return [];
    }

    const items = [
      {term: t("satellites.latitude"), description: position.latitudeLabel},
      {term: t("satellites.longitude"), description: position.longitudeLabel},
      {term: t("satellites.altitude"), description: position.altitudeLabel},
    ];

    if (orbitProfile) {
      items.push(
        {term: t("satellites.perigee"), description: formatAltitudeKm(orbitProfile.summary.minKm)},
        {term: t("satellites.apogee"), description: formatAltitudeKm(orbitProfile.summary.maxKm)},
        {
          term: t("satellites.orbitalPeriod"),
          description: formatOrbitalPeriodMinutes(orbitProfile.summary.periodMinutes),
        },
      );
    }

    return items;
  }, [orbitProfile, position, t]);

  return (
    <>
      <PageHeader
        action={
          <>
            <ButtonLink to={mapSatelliteHref(id, {focus: true})}>
              <MapIcon />
              {t("satellites.viewOnMap")}
            </ButtonLink>
            <ButtonLink to="/satellites">
              <ArrowLeftIcon />
              {t("common.backToList")}
            </ButtonLink>
          </>
        }
        description={satellite?.description ?? t("satellites.fallbackDescription")}
        title={satellite?.name ?? t("satellites.fallbackTitle")}
      />
      <LoadableContent
        empty={!satellite}
        emptyMessage={t("satellites.notFound")}
        errorMessage={errorMessage}
        errorTitle={t("satellites.detailLoadFailed")}
        loading={loading}
        loadingVariant="detail"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        {satellite ? (
          <DetailStack>
            <DetailHero>
              <CoverImage alt="" src={satellite.image} />
              <Card icon={<DomainIcon name="satellites" />} title={t("common.identity")}>
                <MetaList
                  items={[
                    {
                      term: t("common.status"),
                      description: (
                        <StatusPill
                          label={satellite.status ?? t("common.unknown")}
                          tone={satelliteStatusTone(satellite.status)}
                        />
                      ),
                    },
                    {term: t("common.manufacturer"), description: satellite.manufacturer ?? "-"},
                    {term: t("common.bus"), description: satellite.busType ?? "-"},
                    {
                      term: t("satellites.constellation"),
                      description: satellite.Constellation ? (
                        <TextLink to="/constellations">{satellite.Constellation.name}</TextLink>
                      ) : (
                        t("common.none")
                      ),
                    },
                  ]}
                />
                {satellite.description ? (
                  <p className={styles.copy}>{satellite.description}</p>
                ) : null}
              </Card>
            </DetailHero>
            <DetailGrid>
              <Card icon={<DomainIcon name="map" />} title={t("common.position")}>
                {position ? (
                  <MetaList items={positionItems} />
                ) : (
                  <p className={styles.copy}>{t("satellites.positionUnavailable")}</p>
                )}
              </Card>
              <Card title={t("satellites.launch")}>
                {satellite.Launch ? (
                  <MetaList
                    items={[
                      {
                        term: t("satellites.provider"),
                        description: satellite.Launch.provider ?? "-",
                      },
                      {term: t("satellites.rocket"), description: satellite.Launch.rocket ?? "-"},
                      {
                        term: t("satellites.launchDate"),
                        description: formatUtcDate(satellite.Launch.date, language),
                      },
                      {term: t("common.status"), description: satellite.Launch.status ?? "-"},
                      {term: t("satellites.outcome"), description: satellite.Launch.outcome ?? "-"},
                    ]}
                  />
                ) : (
                  <p className={styles.copy}>{t("satellites.noLaunch")}</p>
                )}
              </Card>
            </DetailGrid>
            {orbitProfile ? (
              <SatelliteOrbitChart samples={orbitProfile.samples} summary={orbitProfile.summary} />
            ) : null}
            <Card title={t("satellites.specs")}>
              <DataTable
                columns={specColumns}
                empty={<EmptyState message={t("satellites.noSpecs")} />}
                filterPlaceholder={t("satellites.searchSpecs")}
                getRowId={(row) => row.key}
                rows={specs}
              />
            </Card>
            <Card title={t("satellites.tle")}>
              {tle ? (
                <pre className={styles.tle}>
                  {tle.line1}
                  {"\n"}
                  {tle.line2}
                </pre>
              ) : (
                <p className={styles.copy}>{t("satellites.noTle")}</p>
              )}
            </Card>
            <Card icon={<DomainIcon name="payloads" />} title={t("nav.payloads")}>
              <DataTable
                columns={payloadColumns}
                empty={<EmptyState message={t("satellites.noPayloads")} />}
                filterPlaceholder={t("payloads.search")}
                getRowHref={(row) => `/payloads/${row.id}`}
                getRowId={(row) => row.id}
                rows={payloads}
              />
            </Card>
          </DetailStack>
        ) : null}
      </LoadableContent>
    </>
  );
}
