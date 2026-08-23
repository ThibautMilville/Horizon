import type {CodegenConfig} from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.VITE_GRAPHQL_URI?.trim() || "http://localhost:3000/graphql",
  documents: ["src/**/*.graphql"],
  generates: {
    "src/shared/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        onlyOperationTypes: true,
        scalars: {
          Date: {input: "string", output: "string"},
          JSON: {input: "unknown", output: "unknown"},
        },
      },
    },
  },
};

export default config;
