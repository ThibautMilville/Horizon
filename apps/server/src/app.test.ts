import { mkdtemp, rm, writeFile } from "node:fs/promises";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import { createServerApp } from "./app.js";

const servers: Server[] = [];
const directories: string[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
    ),
  );
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true })),
  );
});

describe("production server", () => {
  it("serves the SPA entry point for a client-side route", async () => {
    const staticRoot = await mkdtemp(path.join(tmpdir(), "horizon-spa-"));
    directories.push(staticRoot);
    await writeFile(
      path.join(staticRoot, "index.html"),
      "<main>Horizon SPA</main>",
    );

    const server = createServerApp({ staticRoot }).listen(0);
    servers.push(server);
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const { port } = server.address() as AddressInfo;

    const response = await fetch(`http://127.0.0.1:${port}/satellites/example`);

    expect(response.status).toBe(200);
    expect(response.headers.get("strict-transport-security")).toContain(
      "max-age=31536000",
    );
    expect(response.headers.get("content-security-policy")).toBe(
      "upgrade-insecure-requests",
    );
    expect(await response.text()).toContain("Horizon SPA");
  });
});
