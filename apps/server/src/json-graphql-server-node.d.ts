declare module "json-graphql-server/node" {
  import type {RequestHandler} from "express";

  export default function jsonGraphqlExpress(data: unknown): RequestHandler;
}
