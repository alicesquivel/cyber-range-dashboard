// src/content/challengesContent.js

export const CHALLENGES = [
    {
        id: "net-001",
        category: "Networking",
        title: "Ping across VLANs",
        difficulty: "easy",
        points: 50,
        status: "available",
        summary:
            "Verify that the client Pi can reach the DMZ and server VLANs using ICMP.",
        studentHint:
            "Use ping and traceroute from the client Pi to confirm routing is configured correctly.",
        instructorNotes:
            "Good onboarding task. Students should notice if firewall rules block ICMP and adjust accordingly.",
    },
    {
        id: "web-001",
        category: "Web Security",
        title: "Find the fake bank login",
        difficulty: "medium",
        points: 100,
        status: "available",
        summary:
            "Explore the DMZ Pi and locate the vulnerable FakeBank login page.",
        studentHint:
            "Start with the DMZ Pi's IP and look for services running on common web ports. Document the URL you find.",
        instructorNotes:
            "This can precede a SQL injection lab. For now, students just discover and document the target application.",
    },
    {
        id: "log-001",
        category: "Forensics",
        title: "Spot the brute-force attack",
        difficulty: "medium",
        points: 150,
        status: "available",
        summary:
            "Use server logs or captured traffic to identify a brute-force login attempt.",
        studentHint:
            "Look for repeated failed login attempts from the same source IP in a short time window.",
        instructorNotes:
            "Map this to the same event shown on the Scores & Events tab so students connect logs with scoring.",
    },
    {
        id: "flag-001",
        category: "CTF",
        title: "First flag in the DMZ",
        difficulty: "hard",
        points: 200,
        status: "locked",
        summary:
            "In the full CTF setup, this challenge will require exploiting the DMZ web app to retrieve a server-side flag.",
        studentHint:
            "For now, treat this as a placeholder. In the real CTF, your flag submission will be checked by the server.",
        instructorNotes:
            "Do NOT store real flags here. Instead, deploy them on the DMZ app and validate submissions via an API.",
    },
];
