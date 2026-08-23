import path from "node:path";

import cors from "cors";
import express, { type Express } from "express";
import jsonGraphqlExpress from "json-graphql-server/node";

import db from "./db.js";

type ServerAppOptions = {
  staticRoot?: string;
};

export function createServerApp({
  staticRoot,
}: ServerAppOptions = {}): Express {
  const app = express();

  app.use(cors());
  app.use((_request, response, next) => {
    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
    next();
  });
  app.use("/graphql", jsonGraphqlExpress(db));

  if (staticRoot) {
    const root = path.resolve(staticRoot);
    app.use(express.static(root));
    app.get("*", (_request, response) => {
      response.sendFile(path.join(root, "index.html"));
    });
  }

  return app;
}
