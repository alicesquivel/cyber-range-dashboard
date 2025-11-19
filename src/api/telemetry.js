// src/api/telemetry.js
// Local-development telemetry API.
// This file intentionally contains mock/fallback logic so the frontend can
// work while the Raspberry Pi agents and aggregator are under development.
//
// Integration notes for students:
// - Replace the fetch URLs below with the real aggregator endpoints when
//   available (for example: GET /api/nodes or GET /api/nodes/:id/metrics).
// - If your aggregator exposes a realtime endpoint (SSE/WS), the frontend
//   should use that for live updates and use these REST calls only for
//   initial snapshots or historical data.
//
// Example (replace in production):
// async function fetchHealth() {
//   const res = await fetch(`${AGGREGATOR_BASE}/api/nodes/health`);
//   return res.json();
// }
//
// Keep the existing function names (`fetchHealth`, `fetchMetrics`) so the
// rest of the codebase (NetworkTab, NodeDetailPanel) can swap from mock ->
// live by changing the implementation here only.

// ----------------------------------------------------------
// Fetch node health (up / degraded / down)
// ----------------------------------------------------------
import { createApiClient } from './client.js';

const mode = import.meta.env?.VITE_API_MODE || 'mock';
const base = import.meta.env?.VITE_API_BASE || 'http://localhost:8000';
const client = createApiClient({ mode, baseUrl: base });

export const fetchHealth = () => client.fetchHealth();

// ----------------------------------------------------------
// Fetch node metrics (CPU, memory, ping, load)
// ----------------------------------------------------------
export const fetchMetrics = () => client.fetchMetrics();
