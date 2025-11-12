// Jake's area later – for now, dummy health JSON.

export async function fetchHealth() {
    // later: fetch("http://router/health.json")
    return [
        { name: "Router Pi", ip: "10.0.0.1", status: "up" },
        { name: "DMZ Pi", ip: "10.0.0.20", status: "up" },
        { name: "Server Pi", ip: "10.0.0.30", status: "degraded" },
        { name: "Client Pi", ip: "10.0.0.40", status: "up" },
    ];
}
