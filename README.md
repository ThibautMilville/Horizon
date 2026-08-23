# Horizon

Horizon is a React and TypeScript operations console for managing a satellite company's fleet,
constellations, payloads, ground stations, contacts, reports, and customers through the provided
GraphQL API.

## Architecture

The monorepo keeps the provided GraphQL server and a Vite React SPA side by side:

```text
apps/
  server/                 GraphQL API and in-memory seed data (template)
  dashboard/src/
    app/                  Router, shell, Apollo bootstrap, auth gate
    features/
      auth/               Demo sign-in, profile, session
      map/                Fleet map (components /, hooks /, lib /)
      fleet/              Fleet awareness dashboard
      constellations/     Constellation readiness overview
      satellites/         Satellite list and detail
      payloads/           Payload list and detail
      stations/           Ground-station list and detail
      contacts/           Pass list, schedule, detail + autosave
      reports/            Ops reports and comments
      customers/          Customer list and detail
      search/             Cross-entity search (Ctrl/Cmd + K)
      space-weather/      Optional NOAA Kp advisory card
    shared/
      ui/                 Design system by responsibility
      lib/                Cross-feature pure helpers
      hooks/              Shared React adapters
      i18n/ + preferences Operator language, theme, motion
      graphql/            Shared GraphQL documents
    test/                 Shared Vitest helpers and integration tests
```

Feature-oriented layout: each domain owns its routes, pages, `.graphql` documents, hooks, and
domain helpers. `app/` only composes the shell and router. `shared/` holds reusable UI and pure
rules used by more than one feature. The map is the only feature split into `components`, `hooks`,
and `lib` because of its size.

State stays simple on purpose:

- Apollo Client owns remote GraphQL data and cache.
- URL search params own shareable list filters and map selection.
- Local React state covers transient UI.
- `localStorage` persists operator preferences and the demo session.

No global client store is required for the current scope.

### Product behavior worth noting

- Map search (`Ctrl/Cmd + K`) covers satellites, stations, payloads, customers, contacts, and
  reports. Mapped assets focus on the map; other hits open detail routes.
- The contact planner predicts station visibility from the supplied TLEs for the next 24 hours
  (5° minimum elevation, one-minute sampling, 15-minute conflict window). Demo only - not
  flight-certified ephemeris.
- Contact create/autosave runs an advisory command-safety review before dangerous scripts are
  persisted.
- Fleet reads the public NOAA planetary K-index as optional space-weather context (no API key,
  refresh at most every five minutes).

## Application pages

Screens below were captured from the running console (`make dev`, dark theme).

### Sign in

Demo gate for the operator console. Credentials: `Commander` / `commander`.

![Sign in](docs/screenshots/login.jpg)

### Forgot password

Demo recovery screen that explains how password reset would work without calling a real mailer.

![Forgot password](docs/screenshots/forgot-password.jpg)

### Map

Immersive fleet map: satellites, ground stations, ground tracks, day/night terminator, asset
search, and the contact planner panel.

![Map](docs/screenshots/map.jpg)

### Fleet

Live awareness board: readiness metrics, ground-segment health, NOAA Kp context, and an attention
queue across the fleet.

![Fleet](docs/screenshots/fleet.jpg)

### Constellations

Mission-level readiness per constellation, with in-orbit satellites and active payload counts.

![Constellations](docs/screenshots/constellations.jpg)

### Payloads

Catalog of customer payloads on the fleet, with links into identity and owning satellites.

![Payloads](docs/screenshots/payloads.jpg)

![Payload detail](docs/screenshots/payload-detail.jpg)

### Satellites

Fleet inventory with status and orbit context; detail shows identity, position, and payloads.

![Satellites](docs/screenshots/satellites.jpg)

![Satellite detail](docs/screenshots/satellite-detail.jpg)

### Stations

Ground-segment directory and station detail for contracted antenna sites.

![Stations](docs/screenshots/stations.jpg)

![Station detail](docs/screenshots/station-detail.jpg)

### Contacts

Past and upcoming satellite passes. Operators schedule new contacts, edit with autosave, and review
command safety before commit.

![Contacts](docs/screenshots/contacts.jpg)

![Schedule contact](docs/screenshots/contact-schedule.jpg)

![Contact detail](docs/screenshots/contact-detail.jpg)

### Reports

Ops follow-up reports and threaded comments against satellites and/or ground stations.

![Reports](docs/screenshots/reports.jpg)

![Create report](docs/screenshots/report-create.jpg)

![Report detail](docs/screenshots/report-detail.jpg)

### Customers

Mission customers and their employee representatives, with owned payloads on detail.

![Customers](docs/screenshots/customers.jpg)

![Customer detail](docs/screenshots/customer-detail.jpg)

### Profile

Demo operator profile and preference controls (language, theme, text scale, motion).

![Profile](docs/screenshots/profile.jpg)

## Tech stack

- [pnpm](https://pnpm.io/) and [Turbo](https://turbo.build/repo)
- React, Apollo Client, GraphQL Codegen, Recharts, SCSS (see `apps/dashboard/README.md`)
- [Vitest](https://vitest.dev/) for unit and integration tests
- Playwright for the critical production browser flow

## Scripts

**Makefile**

- `make help` --> Show a more detailed version of available Makefile commands
- `make dev` --> Start your development environment
- `make prod-image` --> Build the production image (API + dashboard static, target `prod`)
- `make prod-run` --> Build and run the production image on port 3000
- `make clean` --> Remove temporary files like installed modules and build output, resets the dev environment

**Package.json**

- `pnpm build` --> Runs the `build` script in all workspaces
- `pnpm dev` --> Runs the `dev` script in all workspaces
- `pnpm start` --> Runs the `start` script in all workspaces
- `pnpm lint` --> ESLint on the dashboard
- `pnpm format:check` --> Prettier check on the dashboard
- `pnpm stylelint` --> Stylelint on the dashboard
- `pnpm test` --> Runs tests
- `pnpm test:e2e` --> Builds the application and runs the Chromium end-to-end test
- `pnpm test:watch` --> Runs tests in watch mode
- `pnpm test:coverage` --> Runs tests and collects coverage

## Local setup

```bash
pnpm install --frozen-lockfile
make dev
```

Then open `http://localhost:8080` and sign in with `Commander` / `commander`. The API and GraphiQL
run at `http://localhost:3000/graphql`.

The services run in the background. Use `make logs` to follow their output, `make exec` to open a
shell in the development container, and `make down` to stop the environment.

To run the dashboard and API without the development container, use the workspace commands in
`apps/dashboard/README.md` and `apps/server/README.md`.

To refresh README screenshots against a running `make dev` environment:

```bash
pnpm exec node scripts/capture-readme-screens.mjs
```

## Quality checks

```bash
pnpm test
pnpm test:coverage
pnpm build
pnpm lint
pnpm format:check
pnpm stylelint
pnpm exec playwright install chromium
pnpm test:e2e
```

Unit tests focus on business rules and pure transformations. Integration tests cover the auth gate,
login redirect, Apollo loading/error states, contact autosave concurrency, the custom date picker,
Leaflet marker interaction, map search, pass calculation, command-safety rules, constellation
aggregation, NOAA response parsing, and contact/report/comment mutations. The server
fallback is verified in Node and Playwright exercises the production SPA, asset search, live fleet
dashboard, map selection, and light theme in Chromium.
Generated GraphQL types are excluded from coverage because they contain no authored behavior.
Coverage is enforced at 40% statements/lines, 70% branches, and 60% functions; these are regression
floors, not targets.

## Production

`make prod-image` builds the dashboard and server into the Docker `prod` target. `make prod-run`
serves the SPA and GraphQL endpoint together on port 3000. Override `VITE_GRAPHQL_URI` when the API
is hosted on another origin.

The original exercise statement is preserved in `CHALLENGE.md`. Implementation details and template
changes are documented in `WORK_SUMMARY.md`.

## AI usage

An AI coding assistant was used for review, refactoring suggestions, implementation support, and test
scaffolding. The author selected the product scope and architecture, reviewed the changes, validated
the quality gates, and remains responsible for the submitted solution. GraphQL fields come only from
the provided schema.
