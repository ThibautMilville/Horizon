import {fromDateTimeLocalValue} from "@/shared/lib/datetime-local";

export const REPORT_TYPES = ["Incident", "Maintenance", "Issue", "Other"] as const;

export const REPORT_TYPE_FILTERS = ["", ...REPORT_TYPES] as const;

export type ReportFormValues = {
  type: string;
  date: string;
  title: string;
  content: string;
  employee_id: string;
  satellite_id: string;
  groundStation_id: string;
};

export const emptyReportFormValues: ReportFormValues = {
  type: "Issue",
  date: "",
  title: "",
  content: "",
  employee_id: "",
  satellite_id: "",
  groundStation_id: "",
};

export type CommentFormValues = {
  content: string;
  employee_id: string;
  date: string;
};

export const emptyCommentFormValues: CommentFormValues = {
  content: "",
  employee_id: "",
  date: "",
};

export type ReportInputError = "date" | "type" | "title" | "content" | "employee";
export type CommentInputError = "date" | "content" | "employee";

type InputResult<T, E> = {ok: true; value: T} | {ok: false; error: E};

export function toOptionalAssetId(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function buildReportMutationInput(values: ReportFormValues): InputResult<
  {
    type: string;
    date: string;
    title: string;
    content: string;
    employee_id: string;
    satellite_id: string | null;
    groundStation_id: string | null;
  },
  ReportInputError
> {
  const date = fromDateTimeLocalValue(values.date);
  if (!date) {
    return {ok: false, error: "date"};
  }
  if (!values.type.trim()) {
    return {ok: false, error: "type"};
  }
  if (!values.title.trim()) {
    return {ok: false, error: "title"};
  }
  if (!values.content.trim()) {
    return {ok: false, error: "content"};
  }
  if (!values.employee_id.trim()) {
    return {ok: false, error: "employee"};
  }

  return {
    ok: true,
    value: {
      type: values.type.trim(),
      date,
      title: values.title.trim(),
      content: values.content.trim(),
      employee_id: values.employee_id.trim(),
      satellite_id: toOptionalAssetId(values.satellite_id),
      groundStation_id: toOptionalAssetId(values.groundStation_id),
    },
  };
}

export function buildCommentMutationInput(
  values: CommentFormValues,
  reportId: string,
): InputResult<
  {date: string; content: string; report_id: string; employee_id: string},
  CommentInputError
> {
  const date = fromDateTimeLocalValue(values.date);
  if (!date) {
    return {ok: false, error: "date"};
  }
  if (!values.content.trim()) {
    return {ok: false, error: "content"};
  }
  if (!values.employee_id.trim()) {
    return {ok: false, error: "employee"};
  }

  return {
    ok: true,
    value: {
      date,
      content: values.content.trim(),
      report_id: reportId,
      employee_id: values.employee_id.trim(),
    },
  };
}
