import {useState} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";

import {ReportFormPage} from "./ReportFormPage";
import {emptyReportFormValues, type ReportFormValues} from "./report-form";
import {useCreateReport, useReportFormOptions} from "./useReportForm";

export function ReportCreateRoute() {
  const {t} = useI18n();
  const [values, setValues] = useState<ReportFormValues>(emptyReportFormValues);
  const [formError, setFormError] = useState<string | undefined>();
  const options = useReportFormOptions();
  const create = useCreateReport();

  return (
    <ReportFormPage
      employees={options.employees}
      errorMessage={options.errorMessage}
      formError={formError}
      loading={options.loading}
      onChange={setValues}
      onRetry={options.retry}
      onSubmit={() => {
        setFormError(undefined);
        void create.submit(values).catch((error: unknown) => {
          setFormError(error instanceof Error ? error.message : t("reports.createFailed"));
        });
      }}
      satellites={options.satellites}
      saving={create.saving}
      stations={options.stations}
      values={values}
    />
  );
}
