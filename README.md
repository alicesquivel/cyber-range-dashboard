
# Cyber Range Dashboard Suite (4-Pi Air-Gapped Setup)

A lightweight web dashboard, API, and scoring system designed for your **Cyber Range-in-a-Box** capstone.  
It’s fully self-contained, runs **offline**, and mirrors the network guide:

| Device | Hostname | Role | IP |
|:-------|:----------|:-----|:--|
| Raspberry Pi #1 | `pi-router` | DHCP/DNS + Firewall (`nftables`) | 10.0.0.1 |
| Raspberry Pi #2 | `pi-dmz` | DVWA vulnerable web app | 10.0.0.20 |
| Raspberry Pi #3 | `pi-server` | Dashboard + API + Registry | 10.0.0.30 |
| Raspberry Pi #4 | `pi-client` | Blue-Team workstation + Simulated Internet | 10.0.0.40 |
| Admin Laptop | — | Instructor console | 10.0.0.100 |

All devices connect to the **Netgear GS305P** switch (unmanaged) with regular Cat5e/Cat6 cables.

---

## Overview of Each Component

### 1. `server/` — The API Layer
Runs on **pi-server (10.0.0.30)** using **Node + Express**.

- Provides REST endpoints under `/api/…`
- Keeps **scoreboard**, **events**, and **node list** in memory
- No external dependencies — perfect for air-gapped use
- Endpoints:
  - `GET /api/health` → returns `{ok:true}`
  - `GET /api/scoreboard` → returns all team scores
  - `POST /api/scoreboard/add/:team/:pts` → adds points
  - `POST /api/events` → logs a penalty or event
  - `GET /api/nodes` → lists all Pis and their roles

**Purpose:** Central data hub for all other services (UI and poller).

---

### 2. `ui/` — The React Dashboard
Front-end interface served locally by **nginx**.

- Shows:
  - System health (API + DMZ)
  - Real-time scoreboard
  - Penalty/event submission
  - Node list table (router, dmz, server, client)
- Environment variables (`.env` or build args):
  - `VITE_API_URL=http://10.0.0.30:4001`
  - `VITE_DMZ_URL=http://10.0.0.20`
- No external CDN (all scripts bundled via Vite)

**Purpose:** Student and instructor view of lab status and scoring.

---

### 3. `scoring/` — The Poller Script
Runs on **pi-client (10.0.0.40)** (or DMZ).

- Sends automatic “uptime” points to the API every few seconds
- Can simulate random penalties (or later hook to IDS alerts)
- Environment:
  ```bash
  SERVER_API=http://10.0.0.30:4001
  DVWA_URL=http://10.0.0.20
  ```
- Output example:
  ```
  [poller] Ticking against API=http://10.0.0.30:4001 DVWA=http://10.0.0.20
  ```

**Purpose:** Emulates telemetry reporting and scoring automation.

---

### 4. `docker-compose.pi-server.yml`
One-file deployer for **pi-server**.  
Spins up:
- the API container (port 4001)  
- the UI container (port 8081)

Usage:
```bash
docker compose -f docker-compose.pi-server.yml build
docker compose -f docker-compose.pi-server.yml up -d
```

Then open:
- Dashboard → `http://10.0.0.30:8081`
- API → `http://10.0.0.30:4001/api/scoreboard`

---

### 5. `server-ui.Dockerfile`
Multi-stage build:
1. Builds the React UI with Vite.
2. Copies compiled files into an nginx image for static hosting.

This ensures the whole interface runs locally inside your air-gapped Pi.

---

### 6. `.env.example`
Template for local configuration.
```
VITE_API_URL=http://10.0.0.30:4001
VITE_DMZ_URL=http://10.0.0.20
```
Copy it to `.env` and adjust if your IP plan changes.

---

### 7. Support Files
- `.dockerignore` / `.gitignore` — keep images lean  
- `README.md` — this document (deployment + explanation)

---

## Step-by-Step Setup 

### Hardware Prep
1. Label Pis: **pi-router**, **pi-dmz**, **pi-server**, **pi-client**.
2. Plug all Pis and your laptop into the **Netgear GS305P** switch.
3. Power each Pi with its USB-C adapter.
4. Verify link lights (solid green = power, blinking = activity).

---

### Network Configuration Summary
- Each Pi uses **static IPs** (see table above).
- Router Pi (`pi-router`) handles DHCP/DNS using `dnsmasq`.
- All traffic stays **within the 10.0.0.0/24 subnet** — no Internet access.

---

### Deploy the Dashboard (pi-server 10.0.0.30)
1. Copy the unzipped folder (`cyber-range-suite/`) onto the Pi.
2. From that directory:
   ```bash
   docker compose -f docker-compose.pi-server.yml build
   docker compose -f docker-compose.pi-server.yml up -d
   ```
3. Wait ~1 minute for builds to finish.
4. Check running containers:
   ```bash
   docker ps
   ```
   You should see `cr-api` and `cr-ui`.
5. On any connected device (e.g., your laptop), open  
   **http://10.0.0.30:8081**

---

### Test the API
```bash
curl http://10.0.0.30:4001/api/health
curl http://10.0.0.30:4001/api/scoreboard
curl -X POST http://10.0.0.30:4001/api/scoreboard/add/blue/10
```
Each should return valid JSON confirming the service works.

---

### Run the Poller (pi-client 10.0.0.40)
```bash
cd scoring
npm install --omit=dev
SERVER_API=http://10.0.0.30:4001 DVWA_URL=http://10.0.0.20 node poller.js
```
This will automatically start posting points to the scoreboard.

---

### How It All Fits Together

```
 [pi-client]───┐
 [pi-dmz]──────┼──────▶ [pi-server]──▶ Dashboard UI
 [pi-router]───┘
        │
   (Netgear Switch)
        │
   [Admin Laptop]
```

- **pi-client** sends simulated traffic and points to the API.
- **pi-dmz** hosts the DVWA site.
- **pi-server** collects and displays scores and events.
- **pi-router** isolates the network (firewall rules).
- **Admin laptop** opens the dashboard and observes everything.

---

### Offline & Safety Notes
- No component calls outside IP 10.0.0.0/24.
- Docker images and npm packages should be pre-downloaded once and transferred via USB if necessary.
- Never plug the GS305P into another network.

---

### Troubleshooting
| Symptom | Check / Fix |
|----------|--------------|
| UI not loading | Run `docker ps`; ensure `cr-ui` and `cr-api` are “Up” |
| “connection refused” | Verify you’re on same subnet and firewall rules allow traffic |
| Scores not updating | Make sure `poller.js` is running on pi-client |
| DVWA unreachable | Confirm pi-dmz IP (10.0.0.20) responds to `ping` |
| Wrong IPs | Edit `.env` and rebuild UI |

---

### Educational Use Cases
- **Blue Team:** Monitor scores, post penalties for downtime.
- **Red Team:** Trigger events by attacking DVWA.
- **Instructor:** Add or subtract points manually via API.
- **Students:** Learn how local networks, services, and dashboards interact.

---

### Directory Summary

```
cyber-range-suite/
├── docker-compose.pi-server.yml   # Run on pi-server
├── server-ui.Dockerfile           # Build UI + nginx
├── .env.example                   # Local config
├── server/                        # Express API
│   ├── index.js
│   └── package.json
├── ui/                            # React dashboard
│   ├── src/
│   └── vite.config.js
├── scoring/                       # Poller script
│   ├── poller.js
│   └── package.json
└── README.md                      # This file
```

---

### Credits
Developed for the **University of Missouri Cyber Range-in-a-Box Capstone** mentor  
by **Alicia Esquivel Morel et al.**, 2025.  
Uses open-source software: Node.js, Express, React, Docker, Vite.  
All components can run fully offline for educational and research use.
