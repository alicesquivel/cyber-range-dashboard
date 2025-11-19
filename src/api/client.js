// src/api/client.js
// createApiClient({ mode, baseUrl })
// - mode: 'mock' | 'live' (default: 'mock')
// - baseUrl: where the aggregator is hosted when mode === 'live'

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export function createApiClient({ mode = 'mock', baseUrl = '' } = {}) {
    if (mode === 'live') {
        // live implementations (fetch to aggregator)
        const live = {
            async fetchHealth() {
                const res = await fetch(`${baseUrl}/api/nodes`);
                if (!res.ok) throw new Error('fetchHealth failed');
                const nodes = await res.json();
                // map to health-style objects if needed
                return nodes.map((n) => ({ ip: n.ip, status: 'up' }));
            },

            async fetchMetrics() {
                const res = await fetch(`${baseUrl}/api/nodes`);
                if (!res.ok) throw new Error('fetchMetrics failed');
                const nodes = await res.json();
                // live aggregator should provide /api/nodes/:id/metrics for real time
                return nodes.map((n) => ({ ip: n.ip, cpu: 0, memFreeMb: 0, pingMs: 0, load1m: 0 }));
            },

            async fetchScores() {
                const res = await fetch(`${baseUrl}/api/scores`);
                if (!res.ok) throw new Error('fetchScores failed');
                return res.json();
            },

            async fetchScoreSummary() {
                const res = await fetch(`${baseUrl}/api/scores/summary`);
                if (!res.ok) throw new Error('fetchScoreSummary failed');
                return res.json();
            },

            async fetchScoreEvents() {
                const res = await fetch(`${baseUrl}/api/scores/events`);
                if (!res.ok) throw new Error('fetchScoreEvents failed');
                return res.json();
            },

            async fetchNetworkFromScoreboard() {
                const res = await fetch(`${baseUrl}/api/network`);
                if (!res.ok) throw new Error('fetchNetworkFromScoreboard failed');
                return res.json();
            },

            async submitFlag(challengeId, flagText) {
                const res = await fetch(`${baseUrl}/api/flags`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ challengeId, flag: flagText }),
                });
                if (!res.ok) throw new Error('submitFlag failed');
                return res.json();
            },

            // subscribe SSE - returns EventSource instance
            subscribeTelemetry(onMessage) {
                const url = `${baseUrl}/api/telemetry/subscribe`;
                const es = new EventSource(url);
                es.onmessage = (ev) => {
                    try {
                        const data = JSON.parse(ev.data);
                        onMessage && onMessage(data);
                    } catch (e) {
                        // ignore
                    }
                };
                return es;
            },
        };

        return live;
    }

    // MOCK IMPLEMENTATIONS (used during frontend development)
    const MOCK_NETWORK = [
        { name: 'Router Pi', ip: '10.0.0.1', vlan: 1, role: 'Router / Firewall' },
        { name: 'DMZ Pi', ip: '10.0.0.20', vlan: 10, role: 'DMZ Web App' },
        { name: 'Server Pi', ip: '10.0.0.30', vlan: 20, role: 'Scoreboard + Registry' },
        { name: 'Client Pi', ip: '10.0.0.40', vlan: 30, role: 'Client / Traffic Generator' },
    ];

    const MOCK_HEALTH = [
        { ip: '10.0.0.1', status: 'up' },
        { ip: '10.0.0.20', status: 'up' },
        { ip: '10.0.0.30', status: 'degraded' },
        { ip: '10.0.0.40', status: 'up' },
    ];

    const MOCK_METRICS = [
        { ip: '10.0.0.1', cpu: 0.32, memFreeMb: 420, pingMs: 1.8, load1m: 0.41 },
        { ip: '10.0.0.20', cpu: 0.27, memFreeMb: 512, pingMs: 2.4, load1m: 0.35 },
        { ip: '10.0.0.30', cpu: 0.44, memFreeMb: 380, pingMs: 2.1, load1m: 0.62 },
        { ip: '10.0.0.40', cpu: 0.21, memFreeMb: 610, pingMs: 3.0, load1m: 0.28 },
    ];

    const MOCK_SCORES = { red: 820, blue: 760, yellow: 640, white: 900 };
    const MOCK_SCORE_SUMMARY = { uptime: 820, penalties: -120, reportBonus: 40, total: 820 };
    const MOCK_SCORE_EVENTS = [
        { time: '10:32:10', team: 'Red Team', delta: -10, category: 'Automatic', reason: 'SYN flood detected from DMZ' },
        { time: '10:29:04', team: 'Blue Team', delta: +15, category: 'Manual', reason: 'Firewall rule added to block attack' },
    ];

    const client = {
        async fetchHealth() {
            await sleep(100);
            return MOCK_HEALTH;
        },
        async fetchMetrics() {
            await sleep(100);
            return MOCK_METRICS;
        },
        async fetchScores() {
            await sleep(120);
            return MOCK_SCORES;
        },
        async fetchScoreSummary() {
            await sleep(120);
            return MOCK_SCORE_SUMMARY;
        },
        async fetchScoreEvents() {
            await sleep(120);
            return MOCK_SCORE_EVENTS;
        },
        async fetchNetworkFromScoreboard() {
            await sleep(120);
            return MOCK_NETWORK;
        },
        async submitFlag(challengeId, flagText) {
            await sleep(250);
            // demo check: accept anything that looks like FLAG{...}
            if (!flagText || !flagText.trim()) return { status: 'empty', message: 'Please enter a flag before submitting.' };
            if (/^FLAG\{.+\}$/i.test(flagText.trim())) return { status: 'correct', message: 'Demo: accepted.' };
            return { status: 'incorrect', message: 'Flag not accepted (demo).' };
        },
        subscribeTelemetry(onMessage) {
            // Mock: simulate events every 2s
            const iv = setInterval(() => {
                const ev = { type: 'telemetry', nodeId: MOCK_NETWORK[Math.floor(Math.random() * MOCK_NETWORK.length)].ip, payload: { ts: new Date().toISOString(), cpu: Math.random() * 0.8 } };
                onMessage && onMessage(ev);
            }, 2000);
            return {
                close() { clearInterval(iv); }
            };
        }
    };

    return client;
}
