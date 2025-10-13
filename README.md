# Cyber Range in a Box — Dashboard

Minimal, production-ready React + Vite + Tailwind app with two routes:

- `/participant` — student/participant view with KPIs, service health, topology, and events
- `/instructor` — instructor view with team scoring, service health, automations, and events

> Built to reflect the proposal's segmented VLAN topology, DMZ/Server/Client roles, simulated internet, local registry, and scoring model (Uptime − Penalties + Report Bonus).

## Quickstart

1) **Install Node.js 18+** (or 20+).
2) In a terminal:
   ```bash
   cd cyber-range-dashboard
   npm install
   npm run dev
   ```
3) Open http://localhost:5173 and use the nav to switch between Participant and Instructor.

## Tech Stack

- React 18 + Vite 5
- TailwindCSS 3
- React Router 6

## Project Structure

```text
cyber-range-dashboard/
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ vite.config.js
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   ├─ data/
   │  └─ mock.js
   ├─ components/
   │  ├─ KPI.jsx
   │  ├─ ScoreCard.jsx
   │  ├─ ServiceHealthTable.jsx
   │  ├─ TopologyMap.jsx
   │  └─ EventFeed.jsx
   └─ pages/
      ├─ InstructorDashboard.jsx
      └─ ParticipantDashboard.jsx
```

## Customization Hooks

- Replace `src/data/mock.js` with real data from your Pi cluster (e.g., WebSocket or REST endpoints).
- Wire buttons in **Automation** to your orchestration API (e.g., trigger Atomic Red Team campaigns, benign traffic, or re-image scripts).
- Expand **TopologyMap** to display live link status, VLAN IDs, and device health.

## Tailwind Build Notes

- No CSS frameworks beyond Tailwind.
- Accessible defaults, minimal but clean UI; light-first, with easy path to add dark mode later.

## Deploy to GitHub Pages (optional)

1) Add a deployment script:
   ```json
   // package.json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
   and install `gh-pages`:
   ```bash
   npm i -D gh-pages
   ```
2) Set `"homepage"` or configure your repo's Pages to deploy from `/dist` using GitHub Actions.

## Create GitHub Repo & Push

From the project root:

```bash
git init
git add -A
git commit -m "feat: initial dashboard (participant + instructor)"
# create a new repo at https://github.com/new (choose name `cyber-range-dashboard`)
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/cyber-range-dashboard.git
git push -u origin main
```

## MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
