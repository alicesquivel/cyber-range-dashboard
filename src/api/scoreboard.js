// src/api/scoreboard.js
// Dummy scoreboard + network data for the dashboard.
//
// Later, Josh can replace these functions with real API calls
// to the Raspberry Pi scoreboard / FastAPI backend.

// ---------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------

const DUMMY_TEAM_SCORES = {
    red: 820,
    blue: 760,
    yellow: 640,
    white: 900,
};

const DUMMY_SCORE_SUMMARY = {
    uptime: 820,
    penalties: -120,
    reportBonus: 40,
    total: 820, // uptime + penalties + reportBonus
};

// Each event represents a score delta.
const DUMMY_SCORE_EVENTS = [
    {
        time: "10:32:10",
        team: "Red Team",
        delta: -10,
        category: "Automatic",
        reason: "SYN flood detected from DMZ",
    },
    {
        time: "10:29:04",
        team: "Blue Team",
        delta: +15,
        category: "Manual",
        reason: "Firewall rule added to block attack",
    },
    {
        time: "10:21:19",
        team: "Yellow Team",
        delta: +5,
        category: "Manual",
        reason: "Incident report submitted",
    },
    {
        time: "10:18:44",
        team: "Red Team",
        delta: -20,
        category: "Automatic",
        reason: "Brute-force login attempt on Server Pi",
    },
];

// Same dummy network map Josh will eventually feed from the scoreboard.
const DUMMY_NETWORK = [
    {
        name: "Router Pi",
        ip: "10.0.0.1",
        vlan: 1,
        role: "Router / Firewall",
    },
    {
        name: "DMZ Pi",
        ip: "10.0.0.20",
        vlan: 10,
        role: "DMZ Web App",
    },
    {
        name: "Server Pi",
        ip: "10.0.0.30",
        vlan: 20,
        role: "Scoreboard + Registry",
    },
    {
        name: "Client Pi",
        ip: "10.0.0.40",
        vlan: 30,
        role: "Client / Traffic Generator",
    },
];

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------

export async function fetchScores() {
    // TODO(Josh): replace with GET /scores
    await sleep(200);
    return DUMMY_TEAM_SCORES;
}

export async function fetchScoreSummary() {
    // TODO(Josh): replace with GET /scores/summary
    await sleep(200);
    return DUMMY_SCORE_SUMMARY;
}

export async function fetchScoreEvents() {
    // TODO(Josh): replace with GET /scores/events
    await sleep(200);
    return DUMMY_SCORE_EVENTS;
}

export async function fetchNetworkFromScoreboard() {
    // TODO(Jake): replace with /network or /nodes endpoint if needed
    await sleep(200);
    return DUMMY_NETWORK;
}
