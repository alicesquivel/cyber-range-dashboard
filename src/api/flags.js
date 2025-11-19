import { createApiClient } from './client.js';

const mode = import.meta.env?.VITE_API_MODE || 'mock';
const base = import.meta.env?.VITE_API_BASE || 'http://localhost:8000';
const client = createApiClient({ mode, baseUrl: base });

// Keep the same exported function signature used across the UI. The
// implementation delegates to the adapter which supports 'mock' and 'live'
// modes (toggle via Vite env: VITE_API_MODE=live).
export const submitFlag = (challengeId, flagText) => client.submitFlag(challengeId, flagText);

