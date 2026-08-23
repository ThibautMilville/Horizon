import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Card} from "@/shared/ui/data-display/Card";
import {entitySelectOptions} from "@/shared/lib/entity-select-options";
import {DatePicker} from "@/shared/ui/forms/DatePicker";
import {Field} from "@/shared/ui/forms/Field";
import formStyles from "@/shared/ui/forms/form.module.scss";
import {DetailGrid} from "@/shared/ui/layout/DetailLayout";
import {Select} from "@/shared/ui/forms/Select";
import {Textarea} from "@/shared/ui/forms/Textarea";
import type {NamedEntity} from "@/shared/types/entities";

import type {ContactFormValues} from "@/shared/lib/contact-form-values";
import {CONTACT_TYPES} from "@/shared/lib/contact-schedule";

const CONTACT_TYPE_OPTIONS = CONTACT_TYPES.map((type) => ({value: type, label: type}));

type ContactFieldsProps = {
  layout: "form" | "detail" | "map";
  values: ContactFormValues;
  onChange: (values: ContactFormValues) => void;
  satellites: NamedEntity[];
  stations: NamedEntity[];
  employees: NamedEntity[];
  payloads: NamedEntity[];
  optionsLoading?: boolean;
};

export function ContactFields({
  layout,
  values,
  onChange,
  satellites,
  stations,
  employees,
  payloads,
  optionsLoading,
}: ContactFieldsProps) {
  const {t} = useI18n();
  const required = layout === "form";
  const span = layout !== "form";
  const payloadLabel = layout === "detail" ? t("common.payload") : t("common.payloadOptional");
  const selectPlaceholder = (ready: string) =>
    layout === "map"
      ? optionsLoading
        ? t("common.loading")
        : ready
      : required
        ? ready
        : undefined;

  const dateField = (
    <Field label={layout === "map" ? t("map.instantUtc") : t("common.dateUtc")} span={span}>
      <DatePicker
        includeTime
        onChange={(date) => onChange({...values, date})}
        placeholder={t("common.selectDateTime")}
        required={required || layout === "map"}
        value={values.date}
      />
    </Field>
  );

  const typeField = (
    <Field label={t("common.type")} span={span}>
      <Select
        onChange={(type) => onChange({...values, type})}
        options={CONTACT_TYPE_OPTIONS}
        placeholder={required ? t("common.selectType") : undefined}
        required={required}
        searchable={layout === "map"}
        value={values.type}
      />
    </Field>
  );

  const operatorField = (
    <Field label={t("common.operator")} span={span}>
      <Select
        onChange={(employee_id) => onChange({...values, employee_id})}
        options={entitySelectOptions(employees)}
        placeholder={selectPlaceholder(t("common.selectOperator"))}
        required={required}
        searchable
        value={values.employee_id}
      />
    </Field>
  );

  const satelliteField = (
    <Field label={t("common.satellite")} span={span}>
      <Select
        onChange={(satellite_id) => onChange({...values, satellite_id, payload_id: ""})}
        options={entitySelectOptions(satellites)}
        placeholder={selectPlaceholder(t("common.selectSatellite"))}
        required={required}
        searchable
        value={values.satellite_id}
      />
    </Field>
  );

  const stationField = (
    <Field label={t("common.groundStation")} span={span}>
      <Select
        onChange={(groundStation_id) => onChange({...values, groundStation_id})}
        options={entitySelectOptions(stations)}
        placeholder={selectPlaceholder(t("common.selectStation"))}
        required={required}
        searchable
        value={values.groundStation_id}
      />
    </Field>
  );

  const payloadField = (
    <Field label={payloadLabel} span={span}>
      <Select
        disabled={!values.satellite_id}
        onChange={(payload_id) => onChange({...values, payload_id})}
        options={entitySelectOptions(
          values.satellite_id ? payloads : [],
          values.satellite_id ? [{value: "", label: t("common.noPayload")}] : [],
        )}
        placeholder={
          !values.satellite_id
            ? t("common.selectSatelliteFirst")
            : payloads.length === 0
              ? t("common.noPayloadsOnSatellite")
              : t("common.noPayload")
        }
        searchable={Boolean(values.satellite_id && payloads.length > 0)}
        value={values.payload_id}
      />
    </Field>
  );

  const longTextField = (
    key: "executionScript" | "configurationText",
    label: string,
    info?: string,
    placeholder?: string,
  ) => {
    const textarea = (
      <Textarea
        mono
        onChange={(event) => onChange({...values, [key]: event.target.value})}
        placeholder={placeholder}
        required={required}
        value={values[key]}
      />
    );

    return layout === "detail" ? (
      <Card info={info} title={label}>
        {textarea}
      </Card>
    ) : (
      <Field info={info} label={label} span>
        {textarea}
      </Field>
    );
  };

  const scriptField = longTextField(
    "executionScript",
    t("common.executionScript"),
    t("contacts.scriptNote"),
    layout === "form" ? t("contacts.scriptPlaceholder") : undefined,
  );

  const configurationField = longTextField(
    "configurationText",
    t("common.configurationJson"),
    undefined,
    layout === "form" ? t("contacts.configPlaceholder") : undefined,
  );

  if (layout === "map") {
    return (
      <>
        {dateField}
        {typeField}
        {stationField}
        {satelliteField}
        {values.satellite_id ? payloadField : null}
        {operatorField}
        {scriptField}
        {configurationField}
      </>
    );
  }

  if (layout === "detail") {
    return (
      <>
        <DetailGrid>
          <Card title={t("contacts.pass")}>
            <div className={formStyles.form}>
              {dateField}
              {typeField}
              {operatorField}
            </div>
          </Card>
          <Card title={t("contacts.assets")}>
            <div className={formStyles.form}>
              {satelliteField}
              {stationField}
              {payloadField}
            </div>
          </Card>
        </DetailGrid>
        {scriptField}
        {configurationField}
      </>
    );
  }

  return (
    <>
      {dateField}
      {typeField}
      {satelliteField}
      {stationField}
      {payloadField}
      {operatorField}
      {scriptField}
      {configurationField}
    </>
  );
}
