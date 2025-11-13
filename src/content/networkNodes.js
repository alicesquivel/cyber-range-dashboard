// Central metadata for each range node.
// TODO(Jake + Max): update descriptions and labTips to match the final design.

export const NODE_DETAILS = {
    "10.0.0.1": {
        id: "router",
        displayName: "Router Pi",
        hostname: "pi-router",
        role: "Router / Firewall",
        services: "DHCP, DNS, nftables",
        description:
            "Edge router for the range. Handles routing between VLANs and enforces firewall rules.",
        labTips:
            "If students cannot reach any node, check this device first. Firewall misconfigurations will often show up here.",
    },
    "10.0.0.20": {
        id: "dmz",
        displayName: "DMZ Pi",
        hostname: "pi-dmz",
        role: "DMZ Web App",
        services: "FakeBank, future DVWA",
        description:
            "Public facing DMZ server that intentionally exposes vulnerable web applications.",
        labTips:
            "Use this node for web exploitation labs. A sudden spike in HTTP errors may indicate that someone broke the app.",
    },
    "10.0.0.30": {
        id: "server",
        displayName: "Server Pi",
        hostname: "pi-server",
        role: "Scoreboard + Registry",
        services: "FastAPI, local Docker registry",
        description:
            "Internal services node that hosts the scoreboard API and a private container registry.",
        labTips:
            "If scores stop updating, check that the FastAPI service is running here and that the registry has reachable images.",
    },
    "10.0.0.40": {
        id: "client",
        displayName: "Client Pi",
        hostname: "pi-client",
        role: "Client / Traffic Generator",
        services: "traffic scripts, attack tools",
        description:
            "Client endpoint used to generate normal traffic and launch attacks against the range.",
        labTips:
            "When debugging attacks, verify that tools and scripts on this Pi can reach the expected target IPs and ports.",
    },
};

// Utility to safely look up metadata by IP.
export function getNodeDetails(ip) {
    return NODE_DETAILS[ip] ?? null;
}
