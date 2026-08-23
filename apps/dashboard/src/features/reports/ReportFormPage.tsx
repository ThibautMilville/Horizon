import type {FormEvent} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Button, ButtonLink} from "@/shared/ui/actions/Button";
import {Card} from "@/shared/ui/data-display/Card";
import {entitySelectOptions} from "@/shared/lib/entity-select-options";
import {DatePicker} from "@/shared/ui/forms/DatePicker";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {Field} from "@/shared/ui/forms/Field";
import formStyles from "@/shared/ui/forms/form.module.scss";
import {Input} from "@/shared/ui/forms/Input";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {Select} from "@/shared/ui/forms/Select";
import {Textarea} from "@/shared/ui/forms/Textarea";
import {ArrowLeftIcon, DocumentPlusIcon} from "@/shared/ui/actions/action-icons";
import type {NamedEntity} from "@/shared/types/entities";

import {REPORT_TYPES} from "./report-form";
import type {ReportFormValues} from "./report-form";

type ReportFormPageProps = {
  loading: boolean;
  saving: boolean;
  errorMessage?: string;
  formError?: string;
  values: ReportFormValues;
  satellites: NamedEntity[];
  stations: NamedEntity[];
  employees: NamedEntity[];
  onChange: (values: ReportFormValues) => void;
  onSubmit: () => void;
  onRetry: () => void;
};

export function ReportFormPage({
  loading,
  saving,
  errorMessage,
  formError,
  values,
  satellites,
  stations,
  employees,
  onChange,
  onSubmit,
  onRetry,
}: ReportFormPageProps) {
  const {t} = useI18n();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <>
      <PageHeader
        action={
          <ButtonLink to="/reports">
            <ArrowLeftIcon />
            {t("common.cancel")}
          </ButtonLink>
        }
        description={t("reports.newDescription")}
        title={t("reports.new")}
      />
      <LoadableContent
        errorMessage={errorMessage}
        errorTitle={t("common.loadFormFailed")}
        loading={loading}
        loadingVariant="form"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        <Card title={t("reports.fields")}>
          <form className={formStyles.form} onSubmit={handleSubmit}>
            <Field label={t("common.dateUtc")}>
              <DatePicker
                includeTime
                onChange={(date) => onChange({...values, date})}
                placeholder={t("common.selectDateTime")}
                required
                value={values.date}
              />
            </Field>
            <Field label={t("common.type")}>
              <Select
                onChange={(type) => onChange({...values, type})}
                options={REPORT_TYPES.map((type) => ({
                  value: type,
                  label: type === "Other" ? t("reports.other") : type,
                }))}
                placeholder={t("common.selectType")}
                required
                value={values.type}
              />
            </Field>
            <Field label={t("common.title")} span>
              <Input
                onChange={(event) => onChange({...values, title: event.target.value})}
                placeholder={t("reports.titlePlaceholder")}
                required
                value={values.title}
              />
            </Field>
            <Field label={t("common.content")} span>
              <Textarea
                onChange={(event) => onChange({...values, content: event.target.value})}
                placeholder={t("reports.contentPlaceholder")}
                required
                value={values.content}
              />
            </Field>
            <Field label={t("common.author")}>
              <Select
                onChange={(employee_id) => onChange({...values, employee_id})}
                options={entitySelectOptions(employees)}
                placeholder={t("common.selectOperator")}
                required
                searchable
                value={values.employee_id}
              />
            </Field>
            <Field label={t("reports.satelliteOptional")}>
              <Select
                onChange={(satellite_id) => onChange({...values, satellite_id})}
                options={entitySelectOptions(satellites, [
                  {value: "", label: t("common.selectSatellite")},
                ])}
                placeholder={t("common.selectSatellite")}
                searchable
                value={values.satellite_id}
              />
            </Field>
            <Field label={t("reports.stationOptional")}>
              <Select
                onChange={(groundStation_id) => onChange({...values, groundStation_id})}
                options={entitySelectOptions(stations, [
                  {value: "", label: t("common.selectStation")},
                ])}
                placeholder={t("common.selectStation")}
                searchable
                value={values.groundStation_id}
              />
            </Field>
            {formError ? <p className={formStyles.error}>{formError}</p> : null}
            <div className={formStyles.actions}>
              <Button disabled={saving} type="submit" variant="primary">
                {saving ? (
                  t("common.saving")
                ) : (
                  <>
                    <DocumentPlusIcon />
                    {t("reports.create")}
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
