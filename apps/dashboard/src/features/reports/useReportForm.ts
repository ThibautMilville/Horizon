import {useMutation} from "@apollo/client";
import {useNavigate} from "react-router-dom";

import {useFormEntityOptions} from "@/shared/hooks/useFormEntityOptions";
import type {MessageKey} from "@/shared/i18n/messages";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {
  CreateCommentDocument,
  CreateReportDocument,
  ReportDetailDocument,
  ReportListDocument,
} from "@/shared/graphql";

import {
  buildCommentMutationInput,
  buildReportMutationInput,
  type CommentFormValues,
  type CommentInputError,
  type ReportFormValues,
  type ReportInputError,
} from "./report-form";

function inputErrorMessage(
  error: ReportInputError | CommentInputError,
  t: ReturnType<typeof useI18n>["t"],
) {
  if (error === "date") {
    return t("common.invalidDate");
  }

  const fieldKeys: Record<Exclude<ReportInputError, "date">, MessageKey> = {
    type: "common.type",
    title: "common.title",
    content: "common.content",
    employee: "common.author",
  };
  return t("common.requiredField", {field: t(fieldKeys[error])});
}

export function useReportFormOptions() {
  const options = useFormEntityOptions();
  return {
    loading: options.loading,
    errorMessage: options.errorMessage,
    satellites: options.satellites,
    stations: options.stations,
    employees: options.employees,
    retry: options.retry,
  };
}

export function useCreateReport() {
  const navigate = useNavigate();
  const {t} = useI18n();
  const [createReport, state] = useMutation(CreateReportDocument, {
    refetchQueries: [{query: ReportListDocument}],
  });

  return {
    saving: state.loading,
    submit: async (values: ReportFormValues) => {
      const input = buildReportMutationInput(values);
      if (!input.ok) {
        throw new Error(inputErrorMessage(input.error, t));
      }

      const result = await createReport({
        variables: input.value,
      });

      const id = result.data?.createReport?.id;
      if (id) {
        navigate(`/reports/${id}`);
      }
    },
  };
}

export function useCreateComment(reportId: string) {
  const {t} = useI18n();
  const [createComment, state] = useMutation(CreateCommentDocument, {
    refetchQueries: [{query: ReportDetailDocument, variables: {id: reportId}}],
  });

  return {
    saving: state.loading,
    submit: async (values: CommentFormValues) => {
      const input = buildCommentMutationInput(values, reportId);
      if (!input.ok) {
        throw new Error(inputErrorMessage(input.error, t));
      }

      await createComment({
        variables: input.value,
      });
    },
  };
}
