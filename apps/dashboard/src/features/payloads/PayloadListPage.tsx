import {useMemo} from "react";

import {mapSatelliteHref} from "@/shared/lib/map-href";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {payloadStatusTone} from "@/shared/lib/status-tone";
import {MapIcon} from "@/shared/ui/actions/action-icons";
import {Card} from "@/shared/ui/data-display/Card";
import {
  DataTable,
  dataTableEntityLinkColumn,
  dataTableLinkActionColumn,
  type DataTableColumn,
} from "@/shared/ui/data-display/DataTable";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {Field} from "@/shared/ui/forms/Field";
import {entitySelectOptions} from "@/shared/lib/entity-select-options";
import {FilterBar} from "@/shared/ui/forms/FilterBar";
import {Select} from "@/shared/ui/forms/Select";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {TextLink} from "@/shared/ui/navigation/TextLink";
import type {NamedEntity} from "@/shared/types/entities";

import {filterLabel} from "@/shared/lib/filter-counts";

import {PAYLOAD_STATUS_FILTERS} from "./usePayloadList";

import styles from "./PayloadListPage.module.scss";

type PayloadListRow = {
  id: string;
  name: string;
  status?: string | null;
  category?: string | null;
  Satellite?: NamedEntity | null;
  Customer?: NamedEntity | null;
};

type PayloadListPageProps = {
  loading: boolean;
  errorMessage?: string;
  status: string;
  statusCounts: Record<string, number>;
  satelliteId: string;
  customerId: string;
  rows: PayloadListRow[];
  satellites: NamedEntity[];
  customers: NamedEntity[];
  onStatusChange: (status: string) => void;
  onSatelliteChange: (id: string) => void;
  onCustomerChange: (id: string) => void;
  onRetry: () => void;
};

export function PayloadListPage({
  loading,
  errorMessage,
  status,
  statusCounts,
  satelliteId,
  customerId,
  rows,
  satellites,
  customers,
  onStatusChange,
  onSatelliteChange,
  onCustomerChange,
  onRetry,
}: PayloadListPageProps) {
  const {t} = useI18n();
  const columns = useMemo<DataTableColumn<PayloadListRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("common.name"),
        filterVariant: "text",
        Cell: ({row}) => (
          <TextLink to={`/payloads/${row.original.id}`}>{row.original.name}</TextLink>
        ),
      },
      {
        accessorKey: "status",
        header: t("common.status"),
        filterVariant: "select",
        Cell: ({row}) => (
          <StatusPill
            label={row.original.status ?? t("common.unknown")}
            tone={payloadStatusTone(row.original.status)}
          />
        ),
      },
      {accessorKey: "category", header: t("common.category"), filterVariant: "select"},
      dataTableEntityLinkColumn(
        "satellite",
        t("common.satellite"),
        (row) => row.Satellite,
        (satellite) => `/satellites/${satellite.id}`,
      ),
      dataTableEntityLinkColumn(
        "customer",
        t("common.customer"),
        (row) => row.Customer,
        (customer) => `/customers/${customer.id}`,
      ),
      dataTableLinkActionColumn(
        (row) => (row.Satellite?.id ? mapSatelliteHref(row.Satellite.id) : undefined),
        {header: t("nav.map"), icon: <MapIcon />, label: t("common.mapAction")},
      ),
    ],
    [t],
  );

  return (
    <>
      <PageHeader description={t("payloads.description")} title={t("payloads.title")} />
      <div className={styles.filters}>
        <FilterBar
          aria-label={t("payloads.filterAria")}
          flush
          onChange={onStatusChange}
          options={PAYLOAD_STATUS_FILTERS.map((value) => ({
            value,
            label: filterLabel(value, t("common.all")),
            count: statusCounts[value] ?? 0,
          }))}
          value={status}
        />
        <div className={styles["owner-filters"]}>
          <Field label={t("common.satellite")}>
            <Select
              onChange={onSatelliteChange}
              options={entitySelectOptions(satellites, [
                {value: "", label: t("payloads.allSatellites")},
              ])}
              placeholder={t("payloads.allSatellites")}
              searchable
              value={satelliteId}
            />
          </Field>
          <Field label={t("common.customer")}>
            <Select
              onChange={onCustomerChange}
              options={entitySelectOptions(customers, [
                {value: "", label: t("payloads.allCustomers")},
              ])}
              placeholder={t("payloads.allCustomers")}
              searchable
              value={customerId}
            />
          </Field>
        </div>
      </div>
      <LoadableContent
        errorMessage={errorMessage}
        errorTitle={t("payloads.loadFailed")}
        loading={loading}
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <Card title={t("payloads.title")}>
          <DataTable
            columns={columns}
            empty={<EmptyState message={t("payloads.emptyFilter")} />}
            filterPlaceholder={t("payloads.search")}
            getRowHref={(row) => `/payloads/${row.id}`}
            getRowId={(row) => row.id}
            rows={rows}
          />
        </Card>
      </LoadableContent>
    </>
  );
}
