# Dashboard

Horizon operator console. Visit `http://localhost:8080` after the GraphQL API is running at `http://localhost:3000/graphql`.

Set `VITE_GRAPHQL_URI` to point Apollo at the API (default `http://localhost:3000/graphql`). The production Docker image builds with `/graphql` for same-origin deploys such as `https://horizon.ozc.fr`.

## Tech Stack

- React 18 and TypeScript
- Vite with lazy feature routes and automatic chunking
- React Router
- Apollo Client and GraphQL Codegen
- Sass (SCSS modules and tokens)
- MUI (`@mui/material`) + Material React Table v3 for list tables (column filters, full-width search)
- Map-scoped cross-entity search with typed badges and keyboard navigation (`Ctrl/Cmd + K`)
- Client-side satellite pass prediction and contact conflict warnings
- Advisory command-safety review before dangerous contact changes are persisted
- Optional NOAA planetary K-index context, refreshed every five minutes without an API key
- Recharts for the live fleet dashboard
- ESLint, Prettier, Stylelint, Vitest, and Playwright

## Scripts

- `pnpm dev` --> Vite dev server on port 8080
- `pnpm build` --> Typecheck and production build
- `pnpm start` --> Preview the production build
- `pnpm codegen` --> Generate typed operations from the live GraphQL schema (Date → string, JSON → unknown)
- `pnpm lint` --> ESLint on `src`
- `pnpm format` / `pnpm format:check` --> Prettier
- `pnpm stylelint` --> Stylelint on SCSS
- `pnpm test` --> Vitest for this workspace

The root `pnpm test:e2e` command builds both workspaces and exercises the production application in
Chromium. The `/fleet` route derives readiness, ground-network health, operational metrics, and its
attention queue from Apollo-managed GraphQL data.

The NOAA feed is public but has no documented quota or availability guarantee. The integration is
optional, retains the latest valid observation during refresh failures, and never blocks the fleet
dashboard. Pass predictions use the challenge TLEs and are product demonstrations, not operational
ephemerides.
