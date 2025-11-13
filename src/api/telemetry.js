// src/api/telemetry.js
// Local-development telemetry API.
// Loads health.json and metrics.json from the /public folder.
//
// Production note:
// Jake can later update the URLs to point at Pi endpoints such as:
//   http://10.0.0.1/health.json
//   http://10.0.0.1/metrics.json
//
// For now, everything loads locally and falls back to dummy data if missing.

// ----------------------------------------------------------
// Fetch node health (up / degraded / down)
// ----------------------------------------------------------
export async function fetchHealth() {
    try {
        // LOCAL development: served from public/health.json
        const res = await fetch("/health.json");
        if (!res.ok) throw new Error("HTTP " + res.status);
        return await res.json();
    } catch (err) {
        console.warn("Using dummy health data:", err);
        return [
            { name: "Router Pi", ip: "10.0.0.1", status: "up" },
            { name: "DMZ Pi", ip: "10.0.0.20", status: "up" },
            { name: "Server Pi", ip: "10.0.0.30", status: "degraded" },
            { name: "Client Pi", ip: "10.0.0.40", status: "up" }
        ];
    }
}

// ----------------------------------------------------------
// Fetch node metrics (CPU, memory, ping, load)
// ----------------------------------------------------------
export async function fetchMetrics() {
    try {
        // LOCAL development: served from public/metrics.json
        const res = await fetch("/metrics.json");
        if (!res.ok) throw new Error("HTTP " + res.status);
        return await res.json();
    } catch (err) {
        console.warn("Using dummy metrics data:", err);
        return [
            {
                ip: "10.0.0.1",
                cpu: 0.32,
                memFreeMb: 420,
                pingMs: 1.8,
                load1m: 0.41
            },
            {
                ip: "10.0.0.20",
                cpu: 0.27,
                memFreeMb: 512,
                pingMs: 2.4,
                load1m: 0.35
            },
            {
                ip: "10.0.0.30",
                cpu: 0.44,
                memFreeMb: 380,
                pingMs: 2.1,
                load1m: 0.62
            },
            {
                ip: "10.0.0.40",
                cpu: 0.21,
                memFreeMb: 610,
                pingMs: 3.0,
                load1m: 0.28
            }
        ];
    }
}
