# Work Summary

## Product vision

Horizon is a React and TypeScript operations console built on the provided GraphQL API. My goal was
not to create a collection of CRUD screens, but to translate Loft's business model into a coherent
operator workflow.

**Live demo:** [horizon.ozc.fr](https://horizon.ozc.fr)

**Demo access:** sign in with the username `Commander` and password `commander`.

Loft enables customers to fly payloads on shared satellite platforms while Loft operates the space
and ground infrastructure. A satellite may carry payloads for several customers, satellites may be
grouped into constellations, and contacts must be scheduled through ground stations before commands
can be executed. Reports and comments provide operational continuity when an event affects a
satellite or a station.

Loft's work around **On-Orbit AI** helped me understand the broader product ambition. My mental
model became an "AWS for space": customers bring their missions and payloads, while Loft provides
reusable space infrastructure and abstracts much of the complexity of spacecraft integration,
launch, operations, and ground software. On-Orbit AI extends that idea by moving part of the data
processing and decision support closer to where data is produced, instead of depending on every raw
observation being sent back to Earth first.

This perspective influenced Horizon directly. I designed it around shared infrastructure,
observability, operator confidence, and mission context rather than treating each satellite as an
isolated record. The product should help people understand what is happening across the fleet and
move safely from information to action.

Based on that understanding, I interpreted Cockpit as a decision and action surface. An operator
should be able to move naturally from fleet awareness to a specific asset, understand its context,
plan an action, review its risk, and document the outcome. Horizon therefore supports the following
product loop:

1. Observe fleet and ground-network health.
2. Find and inspect an operational asset.
3. Understand its relationships, position, orbit, and current context.
4. Identify a ground-station pass and schedule a contact.
5. Review potentially dangerous command content before saving it.
6. Create reports and comments to preserve operational knowledge.

## Main capabilities

- An immersive Leaflet map with satellite and ground-station markers, ground tracks, day/night
  terminator, basemap and layer controls, focus-and-track behavior, shareable selections, and direct
  links from asset pages.
- Map-scoped search across satellites, stations, payloads, customers, contacts, and reports, with
  typed badges and automatic map focus for spatial assets.
- A fleet-awareness dashboard showing satellite readiness, ground-network health, active payloads,
  upcoming contacts, and a recent operational attention queue.
- Satellite detail views that combine specifications, launch information, payload relationships,
  current position, TLE data, and an orbital altitude profile.
- A constellation view that aggregates member satellites, active payloads, and readiness.
- Contact creation and editing, including a serialized autosave that protects against duplicate and
  out-of-order writes.
- A pass planner that uses the supplied TLEs and station coordinates to propose contact windows and
  highlight scheduling conflicts.
- Report creation and comments with explicit validation, error feedback, and retry behavior.
- Optional NOAA SWPC planetary K-index context, isolated from the core GraphQL experience so an
  external-service failure never blocks fleet operations.
- English and French interfaces, responsive navigation, dark/light/high-contrast themes, text-size
  preferences, and reduced-motion support.

## Front-end architecture

The code is organized by business capability. React pages remain focused on rendering, hooks
coordinate data and interaction state, and pure helpers contain rules that can be tested without a
browser.

| Layer | Responsibility | Main examples |
| --- | --- | --- |
| **Operator experience** | Turns fleet information into decisions and actions | Map, fleet dashboard, asset details, contact planning, reports |
| **Application shell** | Composes the SPA and shared navigation | React Router, authentication guard, lazy routes, preferences, toasts |
| **Feature layer** | Owns business capabilities and their UI orchestration | `map`, `fleet`, `satellites`, `contacts`, `reports`, `constellations` |
| **Domain and design-system layer** | Provides tested rules and reusable UI without feature dependencies | `shared/lib`, `shared/hooks`, `shared/ui`, SCSS tokens |
| **State and data layer** | Separates remote, URL, local, and persisted state | Apollo Client, GraphQL Codegen, React Router, React state, `localStorage` |
| **External services** | Supplies business data and optional context | Provided GraphQL API, optional NOAA SWPC feed |

**Primary flow:** Operator → React SPA → feature module → state/data boundary → GraphQL API or
optional NOAA context.

- `app` contains providers, routing, Apollo setup, and the application shell.
- `features` contains business capabilities and their colocated pages, hooks, GraphQL operations,
  styles, and domain helpers.
- The map is split into `components`, `hooks`, and `lib` because it is the largest interaction area.
- `shared/lib` contains cross-feature rules with no UI dependency.
- `shared/ui` is a small internal design system built with SCSS modules, shared tokens, MUI, and
  Material React Table.
- An ESLint boundary prevents shared code from depending on application or feature layers.

## Data and state decisions

Apollo Client owns remote GraphQL state and normalized caching. Explicit entity policies use IDs for
normalization, while list queries replace previous list results rather than merging them
accidentally. GraphQL Codegen keeps operations and variables typed, with JSON values treated as
unknown until validated.

I did not add Redux or Zustand because it would duplicate Apollo-managed data. React Router owns
navigation and shareable URL state, including filters and map selection. Local React state owns
temporary interactions, while the demo session and display preferences are persisted in
`localStorage`. NOAA uses isolated request state because it is optional external context rather than
core business data.

Routes are lazy-loaded so heavy capabilities such as Leaflet, charts, and advanced tables are not all
required for the initial screen. Delayed loading feedback avoids flashing a skeleton during fast
navigations.

## Operational assumptions and safety

The pass planner is a decision-support prototype based on the data available in the challenge. Its
assumptions are made visible to the operator because TLE freshness and contact duration are not
guaranteed by the provided schema.

Command review is an intentional UX safeguard: it helps an operator notice potentially risky
content and confirm their intent. It remains consultative; real command enforcement, authorization,
approvals, and auditability would belong to the production platform and its operational procedures.

NOAA space-weather information is useful context, but it is optional and has no guaranteed service
level. It therefore never blocks the core fleet-management experience.

## Testing and delivery

Tests focus on the journeys where a regression would have the greatest product impact: saving and
editing contacts, navigating between assets, creating operational records, calculating passes,
interacting with the map, and recovering from errors. Unit and integration tests are complemented by
browser-level checks of the main user journey.

Automated quality checks run before delivery, and the application can be built as a production
container. The provided GraphQL schema and business data remain unchanged; the server adjustment is
limited to serving the production SPA correctly.

## AI usage

AI tools were used extensively as a pair-programming and review assistant for implementation drafts,
refactoring options, test scaffolding, and documentation. I made the final product choices, reviewed
and adapted the proposed changes, rejected additions that did not fit the scope, and validated the
result through the quality gates. I remain responsible for the submitted solution and for the
trade-offs documented above.
