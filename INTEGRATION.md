Integration notes — where students should add live data

## Overview

This file explains the exact places in the codebase where students should
implement live data integration with the Raspberry Pis / aggregator. The
frontend currently uses mock data located in `src/api/*` and static files in
`/public` so UI development can continue independently.

## High-level guidance

- The frontend expects a small, consistent set of API functions exported from
  `src/api/*`. To integrate the real backend, replace the implementations in
  `src/api/telemetry.js`, `src/api/scoreboard.js`, and `src/api/flags.js`.
- Keep the exported function names and signatures. This allows the rest of the
  UI to remain unchanged. Example: `fetchHealth()`, `fetchMetrics()`,
  `fetchScores()`, `submitFlag(challengeId, flag)`.
- Prefer a central aggregator (FastAPI) that the Pis push to. The aggregator
  should expose REST endpoints and a realtime SSE/WS endpoint for live UI
  updates.

## Files to modify (clear integration points)

- `src/api/telemetry.js`

  - Implement `fetchHealth()` and `fetchMetrics()` to call the aggregator
    endpoints (e.g. GET `/api/nodes` and GET `/api/nodes/:id/metrics`).
  - If the aggregator provides SSE/WS, use that for live updates and keep
    these functions for snapshots/historical fetches.

- `src/api/scoreboard.js`

  - Implement `fetchScores()`, `fetchScoreSummary()`, `fetchScoreEvents()`,
    and `fetchNetworkFromScoreboard()` to call the aggregator (e.g.
    `/api/scores`, `/api/scores/summary`, `/api/scores/events`, `/api/network`).
  - Keep data shapes consistent (see examples in the frontend components).

- `src/api/flags.js`
  - Replace the local mock `submitFlag` with a POST to `/api/flags` and return
    the server response (status/message). Do not implement flag checking in
    client-side code for production.

## Representative UI files that expect the above

- `src/components/network/NetworkTab.jsx`

  - Calls `fetchNetworkFromScoreboard()` and `fetchHealth()` — expects
    arrays of node objects and health objects. See inline comments in the
    file for expected field names.

- `src/components/challenges/ChallengeDetailDrawer.jsx`

  - Currently uses a demo flag check. Students should call `submitFlag` from
    `src/api/flags.js` instead.

- `src/components/overview/*`, `src/components/scores/*`, `src/components/*`
  - Many components rely on functions in `src/api/*`. Search for `import` of
    those modules to find other integration points.

## Suggested minimal API contract (examples)

- GET /api/nodes
  - [{ id, name, ip, vlan, role }]
- GET /api/nodes/:id/metrics?from=&to=
  - [{ ts (ISO), cpu, mem, rx, tx, ... }]
- GET /api/scores
  - { teamA: 1200, teamB: 980, ... }
- POST /api/flags
  - body { teamId, challengeId, flag }
  - response { status: "correct"|"incorrect"|"empty"|"unknown", message: string }
- SSE/WS /api/telemetry/subscribe
  - { type: "telemetry"|"presence"|"score", nodeId, payload, ts }

## Testing and local development

- Students can run a minimal FastAPI skeleton locally and point the frontend at
  `http://localhost:8000` during development.
- Use `ngrok` when running Pis from remote networks to forward traffic to the
  local aggregator for testing.

## Notes for instructors

- Keep the frontend adapter pattern: if you later add `createApiClient({mode})`
  the frontend can switch between `mock` and `live` with an environment flag.
- Require students to provide a README describing how to start the Pi agent,
  start the aggregator, and run the frontend in `live` mode.

## Contact

If you want, I can also generate:

- a minimal OpenAPI spec for the endpoints above
- a small FastAPI aggregator skeleton
- a sample Pi Python agent (`agent.py`) that posts telemetry
- a `createApiClient` adapter in the frontend

Tell me which artifact to produce next.
