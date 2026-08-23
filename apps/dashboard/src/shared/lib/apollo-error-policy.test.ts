import {ApolloError, gql} from "@apollo/client";
import {describe, expect, it} from "vitest";

import {
  apolloOperatorToastMessage,
  isApolloRequestError,
  isMutationDocument,
} from "./apollo-error-policy";

const queryDoc = gql`
  query FleetOverview {
    __typename
  }
`;

const mutationDoc = gql`
  mutation CreateContact {
    __typename
  }
`;

describe("apollo error policy", () => {
  it("detects mutation documents for operator toasts", () => {
    expect(isMutationDocument(queryDoc)).toBe(false);
    expect(isMutationDocument(mutationDoc)).toBe(true);
  });

  it("detects Apollo request failures for local toast suppression", () => {
    expect(isApolloRequestError(new ApolloError({errorMessage: "failed"}))).toBe(true);
    expect(isApolloRequestError(new Error("invalid date"))).toBe(false);
    expect(isApolloRequestError("boom")).toBe(false);
  });

  it("builds a single operator toast message", () => {
    const fallbacks = {graphql: "GraphQL failed", network: "Network failed"};
    expect(
      apolloOperatorToastMessage([{message: "Unauthorized"}], new Error("offline"), fallbacks),
    ).toBe("Unauthorized");
    expect(apolloOperatorToastMessage([{message: ""}], undefined, fallbacks)).toBe(
      "GraphQL failed",
    );
    expect(apolloOperatorToastMessage(undefined, new Error("offline"), fallbacks)).toBe("offline");
    expect(apolloOperatorToastMessage(undefined, new Error(""), fallbacks)).toBe("Network failed");
    expect(apolloOperatorToastMessage(undefined, undefined, fallbacks)).toBeUndefined();
  });
});
