import {useMemo} from "react";

import {DomainIcon} from "@/shared/ui/actions/DomainIcon";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {payloadStatusTone} from "@/shared/lib/status-tone";
import {ArrowLeftIcon, ConfigIcon} from "@/shared/ui/actions/action-icons";
import {ButtonLink} from "@/shared/ui/actions/Button";
import {Card} from "@/shared/ui/data-display/Card";
import {DataTable, type DataTableColumn} from "@/shared/ui/data-display/DataTable";
import {DetailGrid, DetailStack} from "@/shared/ui/layout/DetailLayout";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {MetaList} from "@/shared/ui/data-display/MetaList";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {TextLink} from "@/shared/ui/navigation/TextLink";

import styles from "./PayloadDetailPage.module.scss";

type ConfigRow = {key: string; value: string};

type PayloadDetailPageProps = {
  loading: boolean;
  errorMessage?: string;
  configuration: ConfigRow[];
  payload?: {
    id: string;
    name: string;
    description?: string | null;
    status?: string | null;
    category?: string | null;
    Satellite?: {id: string; name: string} | null;
    Customer?: {id: string; name: string} | null;
  } | null;
  onRetry: () => void;
};

export function PayloadDetailPage({
  loading,
  errorMessage,
  configuration,
  payload,
  onRetry,
}: PayloadDetailPageProps) {
  const {t} = useI18n();
  const columns = useMemo<DataTableColumn<ConfigRow>[]>(
    () => [
      {accessorKey: "key", header: t("common.key")},
      {accessorKey: "value", header: t("common.value")},
    ],
    [t],
  );

  return (
    <>
      <PageHeader
        action={
          <ButtonLink to="/payloads">
            <ArrowLeftIcon />
            {t("common.backToList")}
          </ButtonLink>
        }
        description={payload?.description ?? t("payloads.fallbackDescription")}
        title={payload?.name ?? t("payloads.fallbackTitle")}
      />
      <LoadableContent
        empty={!payload}
        emptyMessage={t("payloads.notFound")}
        errorMessage={errorMessage}
        errorTitle={t("payloads.detailLoadFailed")}
        loading={loading}
        loadingVariant="detail"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        {payload ? (
          <DetailStack>
            <DetailGrid>
              <Card icon={<DomainIcon name="payloads" />} title={t("common.identity")}>
                <MetaList
                  items={[
                    {
                      term: t("common.status"),
                      description: (
                        <StatusPill
                          label={payload.status ?? t("common.unknown")}
                          tone={payloadStatusTone(payload.status)}
                        />
                      ),
                    },
                    {term: t("common.category"), description: payload.category ?? "-"},
                  ]}
                />
                {payload.description ? <p className={styles.copy}>{payload.description}</p> : null}
              </Card>
              <Card icon={<DomainIcon name="satellites" />} title={t("common.owners")}>
                <MetaList
                  items={[
                    {
                      term: t("common.satellite"),
                      description: payload.Satellite ? (
                        <TextLink to={`/satellites/${payload.Satellite.id}`}>
                          {payload.Satellite.name}
                        </TextLink>
                      ) : (
                        "-"
                      ),
                    },
                    {
                      term: t("common.customer"),
                      description: payload.Customer ? (
                        <TextLink to={`/customers/${payload.Customer.id}`}>
                          {payload.Customer.name}
                        </TextLink>
                      ) : (
                        "-"
                      ),
                    },
                  ]}
                />
              </Card>
            </DetailGrid>
            <Card icon={<ConfigIcon />} title={t("common.configuration")}>
              <DataTable
                columns={columns}
                empty={<EmptyState message={t("payloads.noConfig")} />}
                filterPlaceholder={t("payloads.searchConfig")}
                getRowId={(row) => row.key}
                rows={configuration}
              />
            </Card>
          </DetailStack>
        ) : null}
      </LoadableContent>
    </>
  );
}
