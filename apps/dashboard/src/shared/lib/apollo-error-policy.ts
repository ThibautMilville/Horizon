import {ApolloError} from "@apollo/client";
import {Kind, type DocumentNode} from "graphql";

export function isQueryLoadingWithoutData(loading: boolean, data: unknown): boolean {
  return loading && data === undefined;
}

export function apolloRefetch(refetch: () => Promise<unknown>): void {
  void refetch().catch(() => undefined);
}

export function isMutationDocument(document: DocumentNode): boolean {
  return document.definitions.some(
    (definition) =>
      definition.kind === Kind.OPERATION_DEFINITION && definition.operation === "mutation",
  );
}

export function isApolloRequestError(error: unknown): boolean {
  return error instanceof ApolloError;
}

export function apolloOperatorToastMessage(
  graphQLErrors: readonly {message: string}[] | undefined,
  networkError: Error | null | undefined,
  fallbacks: {graphql: string; network: string},
): string | undefined {
  if (graphQLErrors?.length) {
    return graphQLErrors[0]?.message || fallbacks.graphql;
  }

  if (networkError) {
    return networkError.message || fallbacks.network;
  }

  return undefined;
}
