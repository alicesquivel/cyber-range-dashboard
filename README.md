# Cyber Range Dashboard

Raspberry Pi cyber range dashboard for teaching networking, security, digital forensics, and CTF-style investigations.

This dashboard is part of the Cyber Range in a Box project — a portable, self-contained environment built on Raspberry Pis for hands-on cybersecurity instruction. It includes node monitoring, scoring, challenges with downloadable artifacts, and both student and instructor modes.

---

## Features

### Overview

High-level system status:

- Node health
- Basic metrics (mock data during development)
- Summary of range activity

### Network & Nodes

Detailed view of each Raspberry Pi:

- Role, IP, VLAN
- Health state
- Expandable node detail drawer

### Scores & Events

Displays:

- Score totals
- Event timeline
- Future support for instructor scoring tools

### Challenges / CTF

Mission-based challenge system with:

- Categories, difficulty, and point values
- Student hints
- Instructor-only notes
- Downloadable artifacts (PCAP, logs, PDFs)
- Solved-state tracking using browser localStorage
- Inline challenge detail drawer placed immediately below each challenge

### Instructor Tools

Instructor-only panel providing:

- Range controls (planned)
- Challenge locking/unlocking
- Artifact management
- Internal documentation
- Instructor-only challenge notes

---

# Installation & Development

This project uses **React + Vite**.

## Install dependenciess

```bash
npm install
```
