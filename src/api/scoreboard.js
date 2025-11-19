// src/api/scoreboard.js
// Adapter-based scoreboard API. Delegates to `createApiClient` so the
// frontend can toggle between 'mock' and 'live' implementations via Vite env.
//
// Integration notes for students:
// - Implement the aggregator endpoints (e.g. GET /api/scores) and run the
//   backend locally. Set `VITE_API_MODE=live` and `VITE_API_BASE` to point
//   at the aggregator to test with real data.

import { createApiClient } from './client.js';

const mode = import.meta.env?.VITE_API_MODE || 'mock';
const base = import.meta.env?.VITE_API_BASE || 'http://localhost:8000';
const client = createApiClient({ mode, baseUrl: base });

export const fetchScores = () => client.fetchScores();
export const fetchScoreSummary = () => client.fetchScoreSummary();
export const fetchScoreEvents = () => client.fetchScoreEvents();
export const fetchNetworkFromScoreboard = () => client.fetchNetworkFromScoreboard();
