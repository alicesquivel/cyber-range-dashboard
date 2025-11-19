CyberRange Aggregator — minimal dev skeleton

This lightweight aggregator lets students run a local server that accepts
telemetry from Raspberry Pi agents and exposes simple REST endpoints and an
SSE stream for the frontend to consume.

Quick start (macOS / Linux / WSL):

1. Create a virtual environment and install dependencies

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

2. Run the app

```bash
uvicorn main:app --reload --port 8000
```

3. Endpoints of interest

- GET http://localhost:8000/api/nodes
- GET http://localhost:8000/api/nodes/{nodeId}/metrics
- POST http://localhost:8000/api/telemetry # agent -> aggregator
- GET http://localhost:8000/api/telemetry/subscribe # SSE stream
- GET http://localhost:8000/api/scores
- POST http://localhost:8000/api/flags

Notes for students

- The project is intentionally minimal and keeps all data in-memory. For the
  capstone you should add persistence (SQLite or other) and authentication.
- The SSE endpoint is implemented with a simple in-memory pub/sub queue per
  client. It is suitable for local testing but not for production scale.
- Use this aggregator during development and update the frontend `src/api/*`
  files to call the aggregator endpoints when ready.

Agent example

- A minimal Pi agent example is provided at `backend/agent_example.py`.
- Install `psutil` and `requests` inside your virtualenv to run it:

```bash
pip install psutil requests
python backend/agent_example.py --url http://localhost:8000
```

The agent will POST telemetry to `/api/telemetry` every 5 seconds by default.
