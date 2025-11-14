# Cyber Range Dashboard

Raspberry Pi cyber range dashboard for teaching networking, security, digital forensics, and CTF-style investigations.

This project provides the front-end interface for the Cyber Range in a Box. It is designed for both classroom instruction and self-guided labs. The dashboard includes node health monitoring, scoring, challenge management, downloadable artifacts, and instructor-only documentation.

---

## Features

### Overview

Displays high-level status of all Raspberry Pi nodes, including:

- Node health
- Basic metrics (mock data during development)
- Quick summary of the range

### Network & Nodes

Shows detailed information about every Pi:

- IP, VLAN, and role
- Status (up, degraded, down)
- Side-panel node details (automatic polling)

### Scores & Events

Provides a visual record of:

- Team scores
- Automatic scoring events
- Instructor-assigned bonuses or penalties

### Challenges / CTF

Mission-pack structured challenges with:

- Difficulty, category, and point values
- Student hints
- Instructor notes
- Downloadable artifacts (PCAP, logs, PDFs)
- Local solved tracking stored in the browser
- Expandable inline detail drawer below each challenge

Mission packs include:

- Onboarding & Connectivity
- Web Security & DMZ
- Logging & Forensics
- Main CTF Flags

### Docs

Central location for:

- Student quickstart PDFs
- Dashboard usage instructions
- Instructor-only operational notes

---

## Project Structure
