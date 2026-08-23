import {useMemo} from "react";

import {mapRelatedAssetHref} from "@/shared/lib/map-href";
import {contactTypeTone} from "@/shared/lib/status-tone";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {MapIcon, ScheduleIcon} from "@/shared/ui/actions/action-icons";
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

import {formatUtcDateTime} from "@/shared/lib/datetime-local";
import {type ContactBucket} from "@/shared/lib/contact-schedule";

type ContactListRow = {
  id: string;
  date: string;
  type: string;
  Satellite?: NamedEntity | null;
  GroundStation?: NamedEntity | null;
};

type ContactListPageProps = {
  loading: boolean;
  errorMessage?: string;
  bucket: ContactBucket;
  pastCount: number;
  upcomingCount: number;
  rows: ContactListRow[];
  onBucketChange: (bucket: ContactBucket) => void;
  onRetry: () => void;
};

export function ContactListPage({
  loading,
  errorMessage,
  bucket,
  pastCount,
  upcomingCount,
  rows,
  onBucketChange,
  onRetry,
}: ContactListPageProps) {
  const {t, language} = useI18n();
  const columns = useMemo<DataTableColumn<ContactListRow>[]>(
    () => [
      {
        id: "when",
        header: t("common.when"),
        accessorFn: (row) => new Date(row.date),
        filterVariant: "datetime",
        Cell: ({row}) => (
          <TextLink to={`/contacts/${row.original.id}`}>
            {formatUtcDateTime(row.original.date, language)}
          </TextLink>
        ),
      },
      {
        accessorKey: "type",
        header: t("common.type"),
        filterVariant: "select",
        Cell: ({row}) => (
          <StatusPill label={row.original.type} tone={contactTypeTone(row.original.type)} />
        ),
      },
      dataTableEntityLinkColumn(
        "satellite",
        t("common.satellite"),
        (row) => row.Satellite,
        (satellite) => `/satellites/${satellite.id}`,
      ),
      {
        id: "station",
        header: t("common.station"),
        accessorFn: (row) => row.GroundStation?.name ?? "",
        filterVariant: "text",
        Cell: ({row}) => row.original.GroundStation?.name ?? "-",
      },
      dataTableLinkActionColumn(
        (row) => mapRelatedAssetHref(row.Satellite?.id, row.GroundStation?.id),
        {header: t("nav.map"), icon: <MapIcon />, label: t("common.mapAction")},
      ),
    ],
    [language, t],
  );

  return (
    <>
      <PageHeader
        action={
          <ButtonLink to="/contacts/new" variant="primary">
            <ScheduleIcon />
            {t("contacts.schedule")}
          </ButtonLink>
        }
        description={t("contacts.description")}
        title={t("contacts.title")}
      />
      <FilterBar
        aria-label={t("contacts.filterAria")}
        onChange={(value) => onBucketChange(value as ContactBucket)}
        options={[
          {value: "past", label: t("contacts.past"), count: pastCount},
          {value: "upcoming", label: t("contacts.upcoming"), count: upcomingCount},
        ]}
        value={bucket}
      />
      <LoadableContent
        errorMessage={errorMessage}
        errorTitle={t("contacts.loadFailed")}
        loading={loading}
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <Card title={bucket === "upcoming" ? t("contacts.upcoming") : t("contacts.past")}>
          <DataTable
            columns={columns}
            empty={
              <EmptyState
                message={
                  bucket === "upcoming" ? t("contacts.emptyUpcoming") : t("contacts.emptyPast")
                }
              />
            }
            filterPlaceholder={t("contacts.search")}
            getRowHref={(row) => `/contacts/${row.id}`}
            getRowId={(row) => row.id}
            rows={rows}
          />
        </Card>
      </LoadableContent>
    </>
  );
}
