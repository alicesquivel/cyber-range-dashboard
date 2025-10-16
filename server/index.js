import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// For the air-gapped lab, allowing all origins is OK inside the subnet.
// To restrict: cors({ origin: ["http://10.0.0.30:8081","http://dashboard.local"] })
app.use(cors({ origin: true }));

// In-memory state (classroom)
const scoreboard = {};             // { team: points }
const events = [];                 // [{ts,type,title,value}]
const nodes = [
  { name: "Router (pi-router)", ip: "10.0.0.1",  role: "router", status: "OK" },
  { name: "DMZ (pi-dmz)",       ip: "10.0.0.20", role: "dmz",    status: "Active" },
  { name: "Server (pi-server)", ip: "10.0.0.30", role: "server", status: "Active" },
  { name: "Client (pi-client)", ip: "10.0.0.40", role: "client", status: "Active" }
];

// API
app.get("/api/health", (_, res) => res.json({ ok: true, ts: Date.now() }));

app.get("/api/scoreboard", (_, res) => res.json({ scores: scoreboard }));

app.post("/api/scoreboard/uptime", (req, res) => {
  const { team = "blue", uptime = 1 } = req.body || {};
  scoreboard[team] = (scoreboard[team] || 0) + Number(uptime);
  res.json({ ok: true, scores: scoreboard });
});

app.post("/api/scoreboard/add/:team/:pts", (req, res) => {
  const team = req.params.team;
  const pts = parseInt(req.params.pts || "0", 10);
  scoreboard[team] = (scoreboard[team] || 0) + pts;
  res.json({ ok: true, scores: scoreboard });
});

app.get("/api/events", (_, res) => res.json({ events }));
app.post("/api/events", (req, res) => {
  const { type = "penalty", title = "event", value = -10 } = req.body || {};
  const ev = { ts: Date.now(), type, title, value: Number(value) };
  events.push(ev);
  // penalties also impact the scoreboard (blue by default)
  scoreboard.blue = (scoreboard.blue || 0) + Number(value);
  res.json({ ok: true, event: ev, scores: scoreboard });
});

app.get("/api/nodes", (_, res) => res.json({ nodes }));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`CR API running on :${PORT}`);
});
