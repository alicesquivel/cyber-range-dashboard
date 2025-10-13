Cyber Range Simulator Pack
==========================

This package contains three components to run while your Raspberry Pis are being assembled:

1. `simulator/` - a WebSocket + REST simulator that mimics nodes, telemetry, events, stacks, and scoring.
2. `server/` - a lightweight express API that can be used as the dashboard backend (alternate to simulator).
3. `scoring/` - a scoring poller you can run on the DMZ node (or locally) to post uptime and penalties to the API.

Quick start (requires Node 18+ or Docker):

## Using Node directly (recommended for development)
- Run simulator:
  cd simulator
  npm install
  npm start
  # simulator available at http://localhost:4000, ws: ws://localhost:4000/ws

- Run server (alternate API):
  cd server
  npm install
  npm start
  # API available at http://localhost:4001

- Run scoring poller (demo):
  cd scoring
  npm install
  SERVER_API=http://<server-ip>:4001 DVWA_URL=http://<dmz-ip> npm start

## Using Docker (one-command demo)
- Build and run (from root of this package):
  docker compose -f docker-compose.demo.yml up --build

## Integrating with the dashboard
- Set your dashboard `VITE_API_URL` or Vite proxy to point to `http://<simulator-host>:4000`.
- The simulator exposes endpoints:
  GET /api/vlan-profile
  GET /api/nodes
  GET /api/scoreboard
  GET /api/events
  GET /api/stacks
  POST /api/events
  POST /api/scoreboard/uptime
  POST /api/stacks/:id/:action

## Notes
- The simulator holds state in memory (ok for midterm/demo). For persistence, add a small sqlite or file-based store.
- The scoring poller uses a simple "sqli_test_flag" path you can `curl` to simulate a detected SQL injection attempt.
