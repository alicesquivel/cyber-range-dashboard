// Josh's area later – for now, just dummy data.

export async function fetchScores() {
    // later: fetch("http://pi-server:8080/scores")
    return {
        red: 20,
        blue: 25,
        yellow: 10,
        white: 5,
    };
}

export async function fetchNetworkFromScoreboard() {
    // later: fetch("http://pi-server:8080/network")
    return [
        { name: "Router Pi", ip: "10.0.0.1", vlan: 1 },
        { name: "DMZ Pi", ip: "10.0.0.20", vlan: 10 },
        { name: "Server Pi", ip: "10.0.0.30", vlan: 20 },
        { name: "Client Pi", ip: "10.0.0.40", vlan: 30 },
    ];
}

// Overall score summary – Josh's FastAPI /scores endpoint can match this shape later.
export async function fetchScoreSummary() {
    // later: GET http://pi-server:8080/scores
    return {
        uptime: 820,
        attackPenalties: -120,
        reportBonus: 40,
    };
}

// Event log – Josh's FastAPI /events endpoint can match this shape later.
export async function fetchEvents() {
    // later: GET http://pi-server:8080/events
    // Example fields: time, team, points change, category (auto/manual), and note.
    return [
        {
            time: "10:32:10",
            team: "red",
            points: -10,
            category: "auto",
            note: "SYN flood detected from DMZ",
        },
        {
            time: "10:29:04",
            team: "blue",
            points: +15,
            category: "manual",
            note: "Firewall rule added to block attack",
        },
        {
            time: "10:21:19",
            team: "yellow",
            points: +5,
            category: "manual",
            note: "Incident report submitted",
        },
        {
            time: "10:18:44",
            team: "red",
            points: -20,
            category: "auto",
            note: "Brute-force login attempt on Server Pi",
        },
    ];
}
