import {useState} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {useParams} from "react-router-dom";

import {FullPageState} from "@/shared/ui/layout/FullPageState";

import {ReportDetailPage} from "./ReportDetailPage";
import {emptyCommentFormValues, type CommentFormValues} from "./report-form";
import {useReportDetail} from "./useReportDetail";
import {useCreateComment, useReportFormOptions} from "./useReportForm";

export function ReportDetailRoute() {
  const {id} = useParams();

  const {t} = useI18n();
  if (!id) {
    return (
      <FullPageState description={t("reports.missingId")} title={t("reports.fallbackTitle")} />
    );
  }

  return <ReportDetailRouteBody id={id} />;
}

function ReportDetailRouteBody({id}: {id: string}) {
  const {t} = useI18n();
  const detail = useReportDetail(id);
  const options = useReportFormOptions();
  const createComment = useCreateComment(id);
  const [commentValues, setCommentValues] = useState<CommentFormValues>(emptyCommentFormValues);
  const [commentError, setCommentError] = useState<string | undefined>();

  const loading = detail.loading || (Boolean(detail.report) && options.loading);

  return (
    <ReportDetailPage
      commentError={commentError ?? options.errorMessage}
      comments={detail.comments}
      commentValues={commentValues}
      dateLabel={detail.dateLabel}
      employees={options.employees}
      errorMessage={detail.errorMessage}
      loading={loading}
      onCommentChange={setCommentValues}
      onCommentSubmit={() => {
        setCommentError(undefined);
        void createComment
          .submit(commentValues)
          .then(() => {
            setCommentValues(emptyCommentFormValues);
          })
          .catch((error: unknown) => {
            setCommentError(error instanceof Error ? error.message : t("reports.commentFailed"));
          });
      }}
      onRetry={() => {
        detail.retry();
        options.retry();
      }}
      report={detail.report}
      savingComment={createComment.saving}
    />
  );
}
