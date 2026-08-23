import {useQuery} from "@apollo/client";
import {apolloRefetch, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";

import {ContactListDocument} from "@/shared/graphql";
import {useSearchParamState} from "@/shared/hooks/useSearchParamState";
import {compact} from "@/shared/lib/compact";

import {partitionContacts, type ContactBucket} from "@/shared/lib/contact-schedule";

const CONTACT_BUCKETS: readonly ContactBucket[] = ["past", "upcoming"];

export function useContactList(now: Date = new Date()) {
  const [bucket, setBucket] = useSearchParamState("when", CONTACT_BUCKETS, "past");

  const {data, error, loading, refetch} = useQuery(ContactListDocument);

  const partitioned = partitionContacts(compact(data?.allContacts), now);
  const rows = bucket === "upcoming" ? partitioned.upcoming : partitioned.past;

  return {
    loading: isQueryLoadingWithoutData(loading, data),
    errorMessage: error?.message,
    bucket,
    pastCount: partitioned.past.length,
    upcomingCount: partitioned.upcoming.length,
    rows,
    setBucket,
    retry: () => {
      apolloRefetch(refetch);
    },
  };
}
