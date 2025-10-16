import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

let vlanProfile = { dmz: 10, server: 20, client: 30, internet: 40 };
let nodes = [
  { name: "DMZ", ip: "10.10.10.10", vlan: 10, status: "Active", cpu: 41, temp: 54 },
  { name: "Server", ip: "10.20.20.20", vlan: 20, status: "Stable", cpu: 36, temp: 52 },
  { name: "Client", ip: "10.30.30.30", vlan: 30, status: "Warning", cpu: 63, temp: 60 },
  { name: "Simulated Internet", ip: "198.51.100.5", vlan: 40, status: "Active", cpu: 29, temp: 49 },
];
let scoreboard = { uptime: 820, penalties: -120, bonus: 40 };
let events = [];
let stacks = [
  { id: 'dvwa', name: 'DVWA (Web Exploitation)', state: 'stopped' },
  { id: 'dns-misconfig', name: 'DNS Misconfig Lab', state: 'stopped' }
];

app.get('/api/vlan-profile', (req, res) => res.json(vlanProfile));
app.get('/api/nodes', (req, res) => res.json(nodes));
app.get('/api/scoreboard', (req, res) => res.json(scoreboard));
app.get('/api/events', (req, res) => res.json(events.slice(-100)));
app.get('/api/stacks', (req, res) => res.json(stacks));

app.post('/api/events', (req, res) => {
  const ev = { id: uuidv4(), ...req.body, time: new Date().toISOString() };
  events.push(ev);
  if (ev.type === 'penalty') scoreboard.penalties += ev.value ?? -100;
  broadcast({ type: 'event', payload: ev });
  return res.status(201).json(ev);
});

app.post('/api/scoreboard/uptime', (req, res) => {
  scoreboard.uptime = req.body.uptime ?? scoreboard.uptime;
  broadcast({ type: 'scoreboard', payload: scoreboard });
  res.json(scoreboard);
});

app.post('/api/stacks/:id/:action', (req, res) => {
  const { id, action } = req.params;
  const s = stacks.find(x => x.id === id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  if (action === 'start') {
    s.state = 'starting';
    setTimeout(() => { s.state = 'running'; broadcast({ type:'stack', payload: s }); }, 1500);
    return res.json(s);
  }
  if (action === 'stop') { s.state = 'stopped'; broadcast({ type:'stack', payload: s }); return res.json(s); }
  if (action === 'redeploy') { s.state = 'redeploying'; setTimeout(()=>{ s.state='running'; broadcast({type:'stack', payload:s}) }, 2000); return res.json(s); }
  res.status(400).json({ error: 'Unknown action' });
});

const server = app.listen(4000, () => console.log('Simulator API listening on :4000'));
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast(msg) {
  const str = JSON.stringify(msg);
  wss.clients.forEach(c => c.readyState === 1 && c.send(str));
}

setInterval(() => {
  nodes = nodes.map(n => {
    const cpu = Math.max(1, Math.min(99, n.cpu + (Math.random()*6-3)|0));
    const temp = Math.max(30, Math.min(85, n.temp + (Math.random()*4-2)|0));
    return { ...n, cpu, temp };
  });
  broadcast({ type: 'telemetry', payload: nodes });
}, 5000);

setInterval(() => {
  if (Math.random() < 0.25) {
    const ev = { id: uuidv4(), type: 'penalty', title: 'Blocked SQLi attempt', detail: 'Rule: DMZ-WEB-001', value: -120, time: new Date().toISOString() };
    events.push(ev); scoreboard.penalties += ev.value;
    broadcast({ type: 'event', payload: ev });
  }
}, 12000);

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'init', payload: { nodes, scoreboard, events, stacks } }));
});
