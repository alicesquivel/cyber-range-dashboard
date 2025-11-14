# Cyber Range Dashboard

Raspberry Pi cyber range dashboard for teaching networking, security, digital forensics, and CTF-style investigations.

This project provides the front-end interface for the Cyber Range in a Box. It is designed for both classroom instruction and self-guided labs. The dashboard includes node health monitoring, scoring, challenges, downloadable artifacts, and instructor-only documentation.

---

## Features

### Overview

Displays high-level status of all Raspberry Pi nodes, including:

- Node health
- Basic metrics (mock data during development)
- Summary of the range state

### Network & Nodes

Shows detailed information about each Pi:

- Role, IP, VLAN
- Status (up, degraded, down)
- Inline details drawer for per-node diagnostics

### Scores & Events

Provides a visual log of:

- Team scores
- Automated scoring events
- Instructor-triggered adjustments (future)

### Challenges / CTF

Structured mission-based challenges with:

- Difficulty, category, point values
- Student hints
- Instructor notes
- Downloadable artifacts (PCAPs, PDFs, logs)
- Solved-state tracking stored locally
- Expandable detail drawer directly under each challenge

Mission packs included:

- Onboarding & Connectivity
- Web Security & DMZ
- Logging & Forensics
- Main CTF Flags

### Docs

Centralized documentation:

- Student quickstart PDFs
- Dashboard usage guides
- Instructor-only operational notes

---

## Installation & Development

This project uses **React + Vite**.

Install dependencies:

npm install

powershell
Copy code

Start the development server:

npm run dev

arduino
Copy code

The dashboard will be available at:

http://localhost:5173

rust
Copy code

Build for production:

npm run build

yaml
Copy code

Preview the production build:

npm run preview

yaml
Copy code

---

## Challenge Artifacts

Each challenge stores its files under:

public/challenges/{challenge-id}/

makefile
Copy code

Examples:

public/challenges/net-001/net-001_instructions.pdf
public/challenges/net-001/net-001_ping-sample.pcap
public/challenges/web-001/web-001_fakebank-notes.pdf
public/challenges/log-001/log-001_bruteforce.pcap

sql
Copy code

Artifacts are configured in:

src/content/challengesContent.js

yaml
Copy code

To add a new challenge:

1. Create a folder under `public/challenges/{id}/`
2. Add all artifacts (pcap, logs, PDFs, etc.)
3. Register the challenge in `challengesContent.js`

---

## Student vs Instructor Modes

### Student Mode

- Sees student hints
- Downloads student-facing artifacts
- Tracks solved-state locally

### Instructor Mode

- Sees instructor notes
- Accesses instructor-only docs
- Prepares for future admin tools (unlocking, resets, scoring)

Mode switching is instantaneous and does not require login (offline-friendly).

---

## Telemetry and Score Simulation

During development, the dashboard reads data from:

public/health.json
public/metrics.json

yaml
Copy code

These provide mock telemetry such as:

- Node uptime
- Basic metrics
- CPU/temperature data (demo)

A real deployment can replace these files with APIs or WebSockets.

---

## Roadmap

Planned improvements:

- Backend-validated flag submission
- Real-time live telemetry updates
- Instructor scoring panel
- Multi-team competition scoreboard
- Automated lab document generation
- Optional LMS / GitHub Classroom integration

---

## License

MIT License or institutional license depending on deployment.

---

## Maintainer

Cyber Range in a Box  
Please reach out to the project maintainer or course instructor for support.
