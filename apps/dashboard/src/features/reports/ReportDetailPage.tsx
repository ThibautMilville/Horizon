import type {FormEvent} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Button, ButtonLink} from "@/shared/ui/actions/Button";
import {Card} from "@/shared/ui/data-display/Card";
import {entitySelectOptions} from "@/shared/lib/entity-select-options";
import {DatePicker} from "@/shared/ui/forms/DatePicker";
import {DetailActions, DetailGrid, DetailStack} from "@/shared/ui/layout/DetailLayout";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {LoadableContent} from "@/shared/ui/feedback/LoadableContent";
import {Field} from "@/shared/ui/forms/Field";
import formStyles from "@/shared/ui/forms/form.module.scss";
import {Select} from "@/shared/ui/forms/Select";
import {MetaList} from "@/shared/ui/data-display/MetaList";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import {Textarea} from "@/shared/ui/forms/Textarea";
import {ArrowLeftIcon} from "@/shared/ui/actions/action-icons";
import {TextLink} from "@/shared/ui/navigation/TextLink";
import type {NamedEntity} from "@/shared/types/entities";

import {reportTypeTone} from "@/shared/lib/status-tone";
import type {CommentFormValues} from "./report-form";

import styles from "./ReportDetailPage.module.scss";

type CommentRow = {
  id: string;
  dateLabel: string;
  content: string;
  author: string;
};

type ReportDetailPageProps = {
  loading: boolean;
  errorMessage?: string;
  dateLabel: string;
  report?: {
    id: string;
    title: string;
    type: string;
    content: string;
    Satellite?: NamedEntity | null;
    GroundStation?: NamedEntity | null;
    Employee?: NamedEntity | null;
  } | null;
  comments: CommentRow[];
  employees: NamedEntity[];
  commentValues: CommentFormValues;
  commentError?: string;
  savingComment: boolean;
  onCommentChange: (values: CommentFormValues) => void;
  onCommentSubmit: () => void;
  onRetry: () => void;
};

export function ReportDetailPage({
  loading,
  errorMessage,
  dateLabel,
  report,
  comments,
  employees,
  commentValues,
  commentError,
  savingComment,
  onCommentChange,
  onCommentSubmit,
  onRetry,
}: ReportDetailPageProps) {
  const {t} = useI18n();

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCommentSubmit();
  }

  return (
    <>
      <PageHeader
        action={
          <DetailActions>
            <ButtonLink to="/reports">
              <ArrowLeftIcon />
              {t("common.backToList")}
            </ButtonLink>
          </DetailActions>
        }
        description={t("reports.detailDescription")}
        title={report?.title ?? t("reports.fallbackTitle")}
      />
      <LoadableContent
        empty={!report}
        emptyMessage={t("reports.notFound")}
        errorMessage={errorMessage}
        errorTitle={t("reports.detailLoadFailed")}
        loading={loading}
        loadingVariant="detail"
        onRetry={onRetry}
        retryLabel={t("common.retry")}
      >
        {report ? (
          <DetailStack>
            <DetailGrid>
              <Card title={t("reports.card")}>
                <MetaList
                  items={[
                    {term: t("common.when"), description: dateLabel},
                    {
                      term: t("common.type"),
                      description: (
                        <StatusPill label={report.type} tone={reportTypeTone(report.type)} />
                      ),
                    },
                    {term: t("common.author"), description: report.Employee?.name ?? "-"},
                  ]}
                />
                <p className={styles.content}>{report.content}</p>
              </Card>
              <Card title={t("reports.linkedAssets")}>
                <MetaList
                  items={[
                    {
                      term: t("common.satellite"),
                      description: report.Satellite ? (
                        <TextLink to={`/satellites/${report.Satellite.id}`}>
                          {report.Satellite.name}
                        </TextLink>
                      ) : (
                        t("common.none")
                      ),
                    },
                    {
                      term: t("common.groundStation"),
                      description: report.GroundStation ? (
                        <TextLink to={`/stations/${report.GroundStation.id}`}>
                          {report.GroundStation.name}
                        </TextLink>
                      ) : (
                        t("common.none")
                      ),
                    },
                  ]}
                />
              </Card>
            </DetailGrid>
            <Card title={t("reports.thread")}>
              {comments.length === 0 ? (
                <EmptyState message={t("reports.noComments")} />
              ) : (
                <div className={styles.thread}>
                  {comments.map((comment) => (
                    <article className={styles.comment} key={comment.id}>
                      <div className={styles["comment-meta"]}>
                        {comment.author} - {comment.dateLabel}
                      </div>
                      <p className={styles["comment-body"]}>{comment.content}</p>
                    </article>
                  ))}
                </div>
              )}
              <form className={`${formStyles.form} ${styles.form}`} onSubmit={handleCommentSubmit}>
                <Field label={t("common.dateUtc")}>
                  <DatePicker
                    includeTime
                    onChange={(date) => onCommentChange({...commentValues, date})}
                    placeholder={t("common.selectDateTime")}
                    required
                    value={commentValues.date}
                  />
                </Field>
                <Field label={t("common.author")}>
                  <Select
                    onChange={(employee_id) => onCommentChange({...commentValues, employee_id})}
                    options={entitySelectOptions(employees)}
                    placeholder={t("common.selectOperator")}
                    required
                    searchable
                    value={commentValues.employee_id}
                  />
                </Field>
                <Field label={t("common.comment")} span>
                  <Textarea
                    onChange={(event) =>
                      onCommentChange({...commentValues, content: event.target.value})
                    }
                    placeholder={t("reports.addNote")}
                    required
                    value={commentValues.content}
                  />
                </Field>
                {commentError ? <p className={formStyles.error}>{commentError}</p> : null}
                <div className={formStyles.actions}>
                  <Button disabled={savingComment} type="submit" variant="primary">
                    {savingComment ? t("reports.posting") : t("reports.postComment")}
                  </Button>
                </div>
              </form>
            </Card>
          </DetailStack>
        ) : null}
      </LoadableContent>
    </>
  );
}
