import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const e2ePort = process.env.E2E_PORT ?? "3000";
const e2eOrigin = `http://127.0.0.1:${e2ePort}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: {
    baseURL: e2eOrigin,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm --filter @horizon/server start",
    env: {
      ...process.env,
      PORT: e2ePort,
      STATIC_ROOT: path.resolve("apps/dashboard/dist"),
    },
    reuseExistingServer: !process.env.CI && !process.env.E2E_PORT,
    timeout: 30_000,
    url: `${e2eOrigin}/login`,
  },
});
