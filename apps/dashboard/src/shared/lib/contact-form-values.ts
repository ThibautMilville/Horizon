import {configurationToText} from "./configuration";
import {toDateTimeLocalValue} from "./datetime-local";

export type ContactFormValues = {
  date: string;
  type: string;
  executionScript: string;
  configurationText: string;
  groundStation_id: string;
  satellite_id: string;
  payload_id: string;
  employee_id: string;
};

export const emptyContactFormValues: ContactFormValues = {
  date: "",
  type: "Customer Task",
  executionScript: "",
  configurationText: "{\n}\n",
  groundStation_id: "",
  satellite_id: "",
  payload_id: "",
  employee_id: "",
};

export function contactFormSignature(values: ContactFormValues): string {
  return JSON.stringify(values);
}

export function contactToFormValues(contact: {
  date: string;
  type: string;
  executionScript: string;
  configuration?: unknown;
  groundStation_id: string;
  satellite_id: string;
  payload_id?: string | null;
  employee_id: string;
}): ContactFormValues {
  return {
    date: toDateTimeLocalValue(contact.date),
    type: contact.type,
    executionScript: contact.executionScript,
    configurationText: configurationToText(contact.configuration),
    groundStation_id: contact.groundStation_id,
    satellite_id: contact.satellite_id,
    payload_id: contact.payload_id ?? "",
    employee_id: contact.employee_id,
  };
}
