import {useReportList} from "./useReportList";
import {ReportListPage} from "./ReportListPage";

export function ReportListRoute() {
  const list = useReportList();

  return (
    <ReportListPage
      errorMessage={list.errorMessage}
      loading={list.loading}
      onRetry={list.retry}
      onTypeChange={list.setType}
      rows={list.rows}
      type={list.type}
      typeCounts={list.typeCounts}
    />
  );
}
