import {useCustomerList} from "./useCustomerList";
import {CustomerListPage} from "./CustomerListPage";

export function CustomerListRoute() {
  const list = useCustomerList();

  return (
    <CustomerListPage
      errorMessage={list.errorMessage}
      loading={list.loading}
      onRetry={list.retry}
      rows={list.rows}
    />
  );
}
