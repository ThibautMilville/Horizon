import {useMemo} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {payloadStatusTone} from "@/shared/lib/status-tone";
import {Card} from "@/shared/ui/data-display/Card";
import {
  DataTable,
  dataTableEntityLinkColumn,
  type DataTableColumn,
} from "@/shared/ui/data-display/DataTable";
import {DetailGrid, DetailStack} from "@/shared/ui/layout/DetailLayout";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {MetaList} from "@/shared/ui/data-display/MetaList";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {ArrowLeftIcon} from "@/shared/ui/actions/action-icons";
import {ButtonLink} from "@/shared/ui/actions/Button";
import {TextLink} from "@/shared/ui/navigation/TextLink";
import type {NamedEntity} from "@/shared/types/entities";

type PayloadRow = {
  id: string;
  name: string;
  status?: string | null;
  category?: string | null;
  Satellite?: NamedEntity | null;
};

type CustomerDetailPageProps = {
  loading: boolean;
  errorMessage?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    Employee?: {id: string; name: string; email?: string | null; role?: string | null} | null;
  } | null;
  payloads: PayloadRow[];
  onRetry: () => void;
};

export function CustomerDetailPage({
  loading,
  errorMessage,
  customer,
  payloads,
  onRetry,
}: CustomerDetailPageProps) {
  const {t} = useI18n();
  const columns = useMemo<DataTableColumn<PayloadRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("common.name"),
        Cell: ({row}) => (
          <TextLink to={`/payloads/${row.original.id}`}>{row.original.name}</TextLink>
        ),
      },
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
      {accessorKey: "category", header: t("common.category")},
      dataTableEntityLinkColumn(
        "satellite",
        t("common.satellite"),
        (row) => row.Satellite,
        (satellite) => `/satellites/${satellite.id}`,
      ),
    ],
    [t],
  );

  return (
    <>
      <PageHeader
        action={
          <ButtonLink to="/customers">
            <ArrowLeftIcon />
            {t("common.backToList")}
          </ButtonLink>
        }
        description={t("customers.detailDescription")}
        title={customer?.name ?? t("customers.fallbackTitle")}
      />
      <LoadableContent
        empty={!customer}
        emptyMessage={t("customers.notFound")}
        errorMessage={errorMessage}
        errorTitle={t("customers.detailLoadFailed")}
        loading={loading}
        loadingVariant="detail"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        {customer ? (
          <DetailStack>
            <DetailGrid>
              <Card title={t("common.customer")}>
                <MetaList
                  items={[
                    {term: t("common.name"), description: customer.name},
                    {term: t("common.email"), description: customer.email},
                  ]}
                />
              </Card>
              <Card title={t("common.representative")}>
                {customer.Employee ? (
                  <MetaList
                    items={[
                      {term: t("common.name"), description: customer.Employee.name},
                      {term: t("common.email"), description: customer.Employee.email ?? "-"},
                      {term: t("common.role"), description: customer.Employee.role ?? "-"},
                    ]}
                  />
                ) : (
                  <EmptyState message={t("customers.noRepresentative")} />
                )}
              </Card>
            </DetailGrid>
            <Card title={t("customers.payloads")}>
              <DataTable
                columns={columns}
                empty={<EmptyState message={t("customers.noPayloads")} />}
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
