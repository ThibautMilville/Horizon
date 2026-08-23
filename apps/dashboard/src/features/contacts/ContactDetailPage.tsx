import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {DetailStack} from "@/shared/ui/layout/DetailLayout";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {ArrowLeftIcon} from "@/shared/ui/actions/action-icons";
import {ButtonLink} from "@/shared/ui/actions/Button";
import type {NamedEntity} from "@/shared/types/entities";

import type {ContactFormValues} from "@/shared/lib/contact-form-values";
import type {CommandSafetyAssessment} from "@/shared/lib/command-safety";
import {CommandSafetyReview} from "./CommandSafetyReview";
import {ContactFields} from "./ContactFields";

import styles from "./ContactDetailPage.module.scss";

type ContactDetailPageProps = {
  loading: boolean;
  saving: boolean;
  errorMessage?: string;
  contact?: {id: string} | null;
  values: ContactFormValues;
  satellites: NamedEntity[];
  stations: NamedEntity[];
  employees: NamedEntity[];
  payloads: NamedEntity[];
  safety: CommandSafetyAssessment;
  safetyAcknowledged: boolean;
  safetyBlocked: boolean;
  onChange: (values: ContactFormValues) => void;
  onSafetyAcknowledgedChange: (acknowledged: boolean) => void;
  onRetry: () => void;
};

export function ContactDetailPage({
  loading,
  saving,
  errorMessage,
  contact,
  values,
  satellites,
  stations,
  employees,
  payloads,
  safety,
  safetyAcknowledged,
  safetyBlocked,
  onChange,
  onSafetyAcknowledgedChange,
  onRetry,
}: ContactDetailPageProps) {
  const {t} = useI18n();

  return (
    <>
      <PageHeader
        action={
          <ButtonLink to="/contacts">
            <ArrowLeftIcon />
            {t("common.backToList")}
          </ButtonLink>
        }
        description={t("contacts.detailDescription")}
        title={t("contacts.detailTitle")}
      />
      <LoadableContent
        empty={!contact}
        emptyMessage={t("contacts.notFound")}
        errorMessage={errorMessage}
        errorTitle={t("contacts.detailLoadFailed")}
        loading={loading}
        loadingVariant="detail"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        {contact ? (
          <DetailStack>
            <p className={styles.status}>
              {safetyBlocked
                ? t("contacts.safety.autosavePaused")
                : saving
                  ? t("common.saving")
                  : t("contacts.autosaveOn")}
            </p>
            <ContactFields
              employees={employees}
              layout="detail"
              onChange={onChange}
              payloads={payloads}
              satellites={satellites}
              stations={stations}
              values={values}
            />
            <CommandSafetyReview
              acknowledged={safetyAcknowledged}
              onAcknowledgedChange={onSafetyAcknowledgedChange}
              review={safety}
            />
          </DetailStack>
        ) : null}
      </LoadableContent>
    </>
  );
}
