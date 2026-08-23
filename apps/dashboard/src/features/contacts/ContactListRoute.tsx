import {useContactList} from "./useContactList";
import {ContactListPage} from "./ContactListPage";

export function ContactListRoute() {
  const list = useContactList();

  return (
    <ContactListPage
      bucket={list.bucket}
      errorMessage={list.errorMessage}
      loading={list.loading}
      onBucketChange={list.setBucket}
      onRetry={list.retry}
      pastCount={list.pastCount}
      rows={list.rows}
      upcomingCount={list.upcomingCount}
    />
  );
}
