"""
Minimal FastAPI aggregator skeleton for CyberRange.
- Endpoints:
  - GET /api/nodes
  - GET /api/nodes/{id}/metrics
  - POST /api/telemetry  (Pis push here)
  - GET /api/telemetry/subscribe  (SSE)
  - GET /api/scores
  - POST /api/flags

Run:
  python -m venv .venv
  . .venv/bin/activate
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000

This file is intentionally small and in-memory so students can run it
locally. For production, add persistence, auth, and validation.
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import time
from typing import Dict, Any, List

app = FastAPI(title="cyber-range-aggregator")

# Allow local frontend to call without CORS troubles during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- in-memory stores (simple) ----
NODES = [
    {"id": "node-001", "name": "Router Pi", "ip": "10.0.0.1", "vlan": 1, "role": "Router / Firewall"},
    {"id": "node-020", "name": "DMZ Pi", "ip": "10.0.0.20", "vlan": 10, "role": "DMZ Web App"},
    {"id": "node-030", "name": "Server Pi", "ip": "10.0.0.30", "vlan": 20, "role": "Scoreboard + Registry"},
]

# telemetry_store[nodeId] = list of datapoints
telemetry_store: Dict[str, List[Dict[str, Any]]] = {}
# simple scoreboard totals
scores = {"red": 820, "blue": 760, "yellow": 640}

# Publish/subscribe queue list for SSE subscribers
subscribers: List[asyncio.Queue] = []

# helper: broadcast an event to all subscribers
async def broadcast_event(event: Dict[str, Any]):
    data = json.dumps(event)
    for q in list(subscribers):
        try:
            await q.put(data)
        except asyncio.CancelledError:
            # queue canceled/closed
            continue

# ---- API endpoints ----
@app.get("/api/nodes")
async def list_nodes():
    return NODES

@app.get("/api/nodes/{node_id}/metrics")
async def get_node_metrics(node_id: str, request: Request, from_ts: str = None, to_ts: str = None):
    # return recent telemetry for a node (no filtering implemented here)
    data = telemetry_store.get(node_id, [])
    return data[-100:]

@app.get("/api/scores")
async def get_scores():
    return scores

@app.post("/api/telemetry")
async def post_telemetry(payload: Dict[str, Any]):
    # expected shape: { nodeId: "node-001", payload: { ts: ..., cpu: ..., ... } }
    node_id = payload.get("nodeId")
    p = payload.get("payload")
    if not node_id or not p:
        raise HTTPException(status_code=400, detail="nodeId and payload required")

    telemetry_store.setdefault(node_id, []).append(p)

    # broadcast to subscribers
    event = {"type": "telemetry", "nodeId": node_id, "payload": p, "ts": p.get("ts")}
    # fire-and-forget
    asyncio.create_task(broadcast_event(event))

    return {"status": "accepted"}

@app.post("/api/flags")
async def post_flag(body: Dict[str, Any]):
    # Simple demo acceptance: accept flags that match FLAG{demo}
    challenge_id = body.get("challengeId")
    flag = body.get("flag", "").strip()
    if not challenge_id or not flag:
        return JSONResponse({"status": "empty", "message": "challengeId and flag required"})

    # demo logic (students should replace this with real scoreboard validation)
    if flag.upper() == "FLAG{DEMO-TRUE}" or flag.upper().startswith("FLAG{"):
        return {"status": "correct", "message": "Accepted (demo)."}

    return {"status": "incorrect", "message": "Flag not accepted."}

@app.get("/api/telemetry/subscribe")
async def subscribe_telemetry(request: Request):
    """Server-Sent Events (SSE) endpoint.

    Clients connect and will receive newline-delimited 'data: <json>\n\n' messages.
    """
    queue: asyncio.Queue = asyncio.Queue()
    subscribers.append(queue)

    async def event_generator():
        try:
            # send a welcome/ping
            await queue.put(json.dumps({"type": "info", "message": "connected", "ts": time.time()}))
            while True:
                # if client disconnects, exit
                if await request.is_disconnected():
                    break
                try:
                    data = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"data: {data}\n\n"
                except asyncio.TimeoutError:
                    # keep-alive comment
                    yield ": ping\n\n"
        finally:
            # cleanup
            try:
                subscribers.remove(queue)
            except ValueError:
                pass

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# Simple health endpoint
@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
