import type {FormEvent} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Button, ButtonLink} from "@/shared/ui/actions/Button";
import {Card} from "@/shared/ui/data-display/Card";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import formStyles from "@/shared/ui/forms/form.module.scss";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {ArrowLeftIcon, ScheduleIcon} from "@/shared/ui/actions/action-icons";
import type {NamedEntity} from "@/shared/types/entities";

import type {ContactFormValues} from "@/shared/lib/contact-form-values";
import type {CommandSafetyAssessment} from "@/shared/lib/command-safety";
import {CommandSafetyReview} from "./CommandSafetyReview";
import {ContactFields} from "./ContactFields";

type ContactFormPageProps = {
  title: string;
  loading: boolean;
  saving: boolean;
  errorMessage?: string;
  formError?: string;
  values: ContactFormValues;
  satellites: NamedEntity[];
  stations: NamedEntity[];
  employees: NamedEntity[];
  payloads: NamedEntity[];
  cancelTo: string;
  safety: CommandSafetyAssessment;
  safetyAcknowledged: boolean;
  onChange: (values: ContactFormValues) => void;
  onSafetyAcknowledgedChange: (acknowledged: boolean) => void;
  onSubmit: () => void;
  onRetry: () => void;
};

export function ContactFormPage({
  title,
  loading,
  saving,
  errorMessage,
  formError,
  values,
  satellites,
  stations,
  employees,
  payloads,
  cancelTo,
  safety,
  safetyAcknowledged,
  onChange,
  onSafetyAcknowledgedChange,
  onSubmit,
  onRetry,
}: ContactFormPageProps) {
  const {t} = useI18n();
  const safetyBlocked = safety.requiresAcknowledgement && !safetyAcknowledged;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <>
      <PageHeader
        action={
          <ButtonLink to={cancelTo}>
            <ArrowLeftIcon />
            {t("common.cancel")}
          </ButtonLink>
        }
        description={t("contacts.scheduleDescription")}
        title={title}
      />
      <LoadableContent
        errorMessage={errorMessage}
        errorTitle={t("common.loadFormFailed")}
        loading={loading}
        loadingVariant="form"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <Card title={t("contacts.fields")}>
          <form className={formStyles.form} onSubmit={handleSubmit}>
            <ContactFields
              employees={employees}
              layout="form"
              onChange={onChange}
              payloads={payloads}
              satellites={satellites}
              stations={stations}
              values={values}
            />
            <div className={formStyles.span}>
              <CommandSafetyReview
                acknowledged={safetyAcknowledged}
                onAcknowledgedChange={onSafetyAcknowledgedChange}
                review={safety}
              />
            </div>
            {formError ? <p className={formStyles.error}>{formError}</p> : null}
            <div className={formStyles.actions}>
              <Button disabled={saving || safetyBlocked} type="submit" variant="primary">
                {saving ? (
                  t("common.saving")
                ) : (
                  <>
                    <ScheduleIcon />
                    {t("contacts.schedule")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </LoadableContent>
    </>
  );
}
