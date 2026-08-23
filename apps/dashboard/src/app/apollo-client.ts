import {ApolloClient, HttpLink, InMemoryCache, from, type TypePolicies} from "@apollo/client";
import {onError} from "@apollo/client/link/error";

import {apolloOperatorToastMessage, isMutationDocument} from "@/shared/lib/apollo-error-policy";
import {translate} from "@/shared/i18n/messages";
import {readPreferences} from "@/shared/preferences/preferences";
import {emitToast} from "@/shared/ui/feedback/toast-bus";

const graphqlUri =
  import.meta.env.VITE_GRAPHQL_URI?.trim() ||
  (import.meta.env.DEV ? "http://localhost:3000/graphql" : "/graphql");

const entityTypes = [
  "Satellite",
  "GroundStation",
  "Payload",
  "Customer",
  "Contact",
  "Report",
  "Employee",
  "Comment",
  "Constellation",
  "Launch",
] as const;

const listFields = [
  "allSatellites",
  "allGroundStations",
  "allPayloads",
  "allCustomers",
  "allContacts",
  "allReports",
  "allEmployees",
  "allComments",
  "allConstellations",
] as const;

const typePolicies: TypePolicies = {
  ...Object.fromEntries(entityTypes.map((type) => [type, {keyFields: ["id"]}])),
  Query: {
    fields: Object.fromEntries(listFields.map((field) => [field, {merge: false}])),
  },
};

function fallbackMessage(key: "common.graphqlFailed" | "common.networkFailed"): string {
  return translate(readPreferences().language, key);
}

const errorLink = onError(({graphQLErrors, networkError, operation}) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      console.error(`[GraphQL] ${error.message}`);
    }
  }

  if (networkError) {
    console.error(`[Network] ${networkError.message}`);
  }

  if (!isMutationDocument(operation.query)) {
    return;
  }

  const message = apolloOperatorToastMessage(graphQLErrors, networkError, {
    graphql: fallbackMessage("common.graphqlFailed"),
    network: fallbackMessage("common.networkFailed"),
  });

  if (message) {
    emitToast({tone: "error", message});
  }
});

const httpLink = new HttpLink({uri: graphqlUri});

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({typePolicies}),
});
