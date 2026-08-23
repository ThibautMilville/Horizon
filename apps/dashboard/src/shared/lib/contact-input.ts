import {parseConfigurationText} from "./configuration";
import type {ContactFormValues} from "./contact-form-values";
import {fromDateTimeLocalValue} from "./datetime-local";

export type ContactInputError =
  | "configuration-json"
  | "configuration-object"
  | "date"
  | "type"
  | "execution-script"
  | "ground-station"
  | "satellite"
  | "employee";

export type ContactMutationInput = {
  date: string;
  type: string;
  executionScript: string;
  configuration: Record<string, unknown>;
  groundStation_id: string;
  satellite_id: string;
  payload_id: string | null;
  employee_id: string;
};

type ContactInputResult =
  | {ok: true; value: ContactMutationInput}
  | {ok: false; error: ContactInputError};

export function buildContactMutationInput(
  values: ContactFormValues,
  options: {defaultExecutionScript?: string} = {},
): ContactInputResult {
  const configuration = parseConfigurationText(values.configurationText);
  if (!configuration.ok) {
    return {
      ok: false,
      error: configuration.code === "object" ? "configuration-object" : "configuration-json",
    };
  }

  const date = fromDateTimeLocalValue(values.date);
  if (!date) {
    return {ok: false, error: "date"};
  }

  if (!values.type.trim()) {
    return {ok: false, error: "type"};
  }
  if (!values.groundStation_id.trim()) {
    return {ok: false, error: "ground-station"};
  }
  if (!values.satellite_id.trim()) {
    return {ok: false, error: "satellite"};
  }
  if (!values.employee_id.trim()) {
    return {ok: false, error: "employee"};
  }

  const executionScript = values.executionScript.trim() || options.defaultExecutionScript?.trim();
  if (!executionScript) {
    return {ok: false, error: "execution-script"};
  }

  return {
    ok: true,
    value: {
      date,
      type: values.type.trim(),
      executionScript,
      configuration: configuration.value,
      groundStation_id: values.groundStation_id.trim(),
      satellite_id: values.satellite_id.trim(),
      payload_id: values.payload_id.trim() || null,
      employee_id: values.employee_id.trim(),
    },
  };
}
