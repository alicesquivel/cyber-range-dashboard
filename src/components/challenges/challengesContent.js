// src/components/challenges/challengesContent.js

// Mission packs - logical groupings of challenges.
export const PACKS = [
    {
        id: "onboarding",
        name: "Onboarding & Connectivity",
        description: "Warm-up labs to verify network connectivity and basic logging.",
    },
    {
        id: "websec",
        name: "Web Security & DMZ",
        description: "FakeBank, DMZ services, and basic web exploitation.",
    },
    {
        id: "forensics",
        name: "Logging & Forensics",
        description: "Investigate incidents using logs, PCAPs, and timelines.",
    },
    {
        id: "ctf-main",
        name: "Main CTF Flags",
        description: "Higher-difficulty flags for capstone CTF events.",
    },
];

// CHALLENGE FIELDS
// - id: unique id (also folder name under public/challenges/{id}/)
// - packId: mission pack
// - category, title, difficulty, points, status, summary, studentHint, instructorNotes
// - artifacts: array of downloadable resources for this challenge
//   * label: short description shown in UI
//   * filename: file under public/challenges/{id}/
//   * type: optional hint (pcap, logs, pdf, script, other)
//   * audience: "student" | "instructor" | "both"
export const CHALLENGES = [
    {
        id: "net-001",
        packId: "onboarding",
        category: "Networking",
        title: "Ping across VLANs",
        difficulty: "easy",
        points: 50,
        status: "available",
        summary:
            "Verify that the client Pi can reach the DMZ and server VLANs using ICMP.",
        studentHint:
            "From the client Pi, ping the DMZ and server IPs. Use traceroute to confirm routing and firewall behavior.",
        instructorNotes:
            "Good onboarding task. Students should notice if firewall rules block ICMP and adjust accordingly.",
        artifacts: [
            {
                label: "Lab handout (PDF)",
                filename: "net-001_instructions.pdf",
                type: "pdf",
                audience: "both",
            },
            {
                label: "Sample ICMP capture (PCAP)",
                filename: "net-001_ping-sample.pcap",
                type: "pcap",
                audience: "student",
            },
        ],
    },
    {
        id: "web-001",
        packId: "websec",
        category: "Web Security",
        title: "Find the fake bank login",
        difficulty: "medium",
        points: 100,
        status: "available",
        summary:
            "Explore the DMZ Pi and locate the vulnerable FakeBank login page.",
        studentHint:
            "Start with the DMZ Pi IP. Scan for open web ports, then enumerate paths until you find the fake login.",
        instructorNotes:
            "Precedes a SQL injection or session handling lab. For now, students only need to discover and document the target.",
        artifacts: [
            {
                label: "FakeBank overview (PDF)",
                filename: "web-001_fakebank-notes.pdf",
                type: "pdf",
                audience: "both",
            },
            {
                label: "HTTP traffic sample (PCAP)",
                filename: "web-001_http-traffic.pcap",
                type: "pcap",
                audience: "student",
            },
        ],
    },
    {
        id: "log-001",
        packId: "forensics",
        category: "Forensics",
        title: "Spot the brute-force attack",
        difficulty: "medium",
        points: 150,
        status: "available",
        summary:
            "Use server logs or captured traffic to identify a brute-force login attempt.",
        studentHint:
            "Look for repeated failed logins from the same IP in a short time window. Note timestamps and usernames.",
        instructorNotes:
            "Map this to the same event shown on the Scores & Events tab so students connect logs with scoring.",
        artifacts: [
            {
                label: "Auth log bundle (ZIP)",
                filename: "log-001_auth-logs.zip",
                type: "logs",
                audience: "both",
            },
            {
                label: "Brute-force capture (PCAP)",
                filename: "log-001_bruteforce.pcap",
                type: "pcap",
                audience: "student",
            },
        ],
    },
    {
        id: "flag-001",
        packId: "ctf-main",
        category: "CTF",
        title: "First flag in the DMZ",
        difficulty: "hard",
        points: 200,
        status: "locked",
        summary:
            "In the full CTF, this challenge will require exploiting the DMZ web app to retrieve a server-side flag.",
        studentHint:
            "For now this is a placeholder. In the real CTF, flag submission will be checked by the scoreboard backend.",
        instructorNotes:
            "Do NOT store real flags here. Keep flags on the DMZ service and validate via backend. Frontend only sends guesses.",
        artifacts: [
            {
                label: "Instructor-only DMZ notes (PDF)",
                filename: "flag-001_dmz-hints.pdf",
                type: "pdf",
                audience: "instructor",
            },
        ],
    },
];
