import {useMemo} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Card} from "@/shared/ui/data-display/Card";
import {CoverImage} from "@/shared/ui/data-display/CoverImage";
import {
  DataTable,
  dataTableEntityLinkColumn,
  type DataTableColumn,
} from "@/shared/ui/data-display/DataTable";
import {DetailGrid, DetailHero, DetailStack} from "@/shared/ui/layout/DetailLayout";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {MetaList} from "@/shared/ui/data-display/MetaList";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {ArrowLeftIcon} from "@/shared/ui/actions/action-icons";
import {ButtonLink} from "@/shared/ui/actions/Button";
import {TextLink} from "@/shared/ui/navigation/TextLink";
import type {NamedEntity} from "@/shared/types/entities";

import {stationStatusTone} from "@/shared/lib/status-tone";

type ContactRow = {
  id: string;
  dateLabel: string;
  type: string;
  Satellite?: NamedEntity | null;
};

type ReportRow = {
  id: string;
  dateLabel: string;
  title: string;
  type: string;
};

type StationDetailPageProps = {
  loading: boolean;
  errorMessage?: string;
  coordinatesLabel: string;
  station?: {
    id: string;
    name: string;
    image?: string | null;
    network?: string | null;
    status?: string | null;
  } | null;
  contacts: ContactRow[];
  reports: ReportRow[];
  onRetry: () => void;
};

export function StationDetailPage({
  loading,
  errorMessage,
  coordinatesLabel,
  station,
  contacts,
  reports,
  onRetry,
}: StationDetailPageProps) {
  const {t} = useI18n();
  const contactColumns = useMemo<DataTableColumn<ContactRow>[]>(
    () => [
      {
        accessorKey: "dateLabel",
        header: t("common.when"),
        Cell: ({row}) => (
          <TextLink to={`/contacts/${row.original.id}`}>{row.original.dateLabel}</TextLink>
        ),
      },
      {accessorKey: "type", header: t("common.type")},
      dataTableEntityLinkColumn(
        "satellite",
        t("common.satellite"),
        (row) => row.Satellite,
        (satellite) => `/satellites/${satellite.id}`,
      ),
    ],
    [t],
  );
  const reportColumns = useMemo<DataTableColumn<ReportRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: t("common.title"),
        Cell: ({row}) => (
          <TextLink to={`/reports/${row.original.id}`}>{row.original.title}</TextLink>
        ),
      },
      {accessorKey: "type", header: t("common.type")},
      {accessorKey: "dateLabel", header: t("common.when")},
    ],
    [t],
  );

  return (
    <>
      <PageHeader
        action={
          <ButtonLink to="/stations">
            <ArrowLeftIcon />
            {t("common.backToList")}
          </ButtonLink>
        }
        description={t("stations.detailDescription")}
        title={station?.name ?? t("stations.fallbackTitle")}
      />
      <LoadableContent
        empty={!station}
        emptyMessage={t("stations.notFound")}
        errorMessage={errorMessage}
        errorTitle={t("stations.detailLoadFailed")}
        loading={loading}
        loadingVariant="detail"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        {station ? (
          <DetailStack>
            <DetailHero>
              <CoverImage alt="" src={station.image} />
              <Card title={t("common.identity")}>
                <MetaList
                  items={[
                    {
                      term: t("common.status"),
                      description: (
                        <StatusPill
                          label={station.status ?? t("common.unknown")}
                          tone={stationStatusTone(station.status)}
                        />
                      ),
                    },
                    {term: t("common.network"), description: station.network ?? "-"},
                    {term: t("common.coordinates"), description: coordinatesLabel},
                  ]}
                />
              </Card>
            </DetailHero>
            <DetailGrid>
              <Card title={t("stations.contacts")}>
                <DataTable
                  columns={contactColumns}
                  empty={<EmptyState message={t("stations.noContacts")} />}
                  filterPlaceholder={t("contacts.search")}
                  getRowHref={(row) => `/contacts/${row.id}`}
                  getRowId={(row) => row.id}
                  rows={contacts}
                />
              </Card>
              <Card title={t("stations.reports")}>
                <DataTable
                  columns={reportColumns}
                  empty={<EmptyState message={t("stations.noReports")} />}
                  filterPlaceholder={t("reports.search")}
                  getRowHref={(row) => `/reports/${row.id}`}
                  getRowId={(row) => row.id}
                  rows={reports}
                />
              </Card>
            </DetailGrid>
          </DetailStack>
        ) : null}
      </LoadableContent>
    </>
  );
}
