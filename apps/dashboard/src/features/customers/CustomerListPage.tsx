import {useMemo} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Card} from "@/shared/ui/data-display/Card";
import {DataTable, type DataTableColumn} from "@/shared/ui/data-display/DataTable";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {TextLink} from "@/shared/ui/navigation/TextLink";

type CustomerListRow = {
  id: string;
  name: string;
  email: string;
  Employee?: {id: string; name: string; role?: string | null} | null;
};

type CustomerListPageProps = {
  loading: boolean;
  errorMessage?: string;
  rows: CustomerListRow[];
  onRetry: () => void;
};

export function CustomerListPage({loading, errorMessage, rows, onRetry}: CustomerListPageProps) {
  const {t} = useI18n();
  const columns = useMemo<DataTableColumn<CustomerListRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("common.name"),
        filterVariant: "text",
        Cell: ({row}) => (
          <TextLink to={`/customers/${row.original.id}`}>{row.original.name}</TextLink>
        ),
      },
      {accessorKey: "email", header: t("common.email"), filterVariant: "text"},
      {
        id: "representative",
        header: t("common.representative"),
        accessorFn: (row) => row.Employee?.name ?? "",
        filterVariant: "text",
        Cell: ({row}) => row.original.Employee?.name ?? "-",
      },
      {
        id: "role",
        header: t("common.role"),
        accessorFn: (row) => row.Employee?.role ?? "",
        filterVariant: "select",
        Cell: ({row}) => row.original.Employee?.role ?? "-",
      },
    ],
    [t],
  );

  return (
    <>
      <PageHeader description={t("customers.description")} title={t("customers.title")} />
      <LoadableContent
        errorMessage={errorMessage}
        errorTitle={t("customers.loadFailed")}
        loading={loading}
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <Card title={t("customers.title")}>
          <DataTable
            columns={columns}
            empty={<EmptyState message={t("customers.empty")} />}
            filterPlaceholder={t("customers.search")}
            getRowHref={(row) => `/customers/${row.id}`}
            getRowId={(row) => row.id}
            rows={rows}
          />
        </Card>
      </LoadableContent>
    </>
  );
}
