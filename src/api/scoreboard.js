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
