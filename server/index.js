import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

let events = [];
let scoreboard = { uptime: 1000, penalties: 0, bonus: 0 };
const nodes = [{ name: 'DMZ', ip: '10.10.10.10', vlan: 10, status: 'Active', cpu: 0, temp: 0 }];
const vlanProfile = { dmz: 10, server: 20, client: 30, internet: 40 };
const stacks = [{ id: 'dvwa', name: 'DVWA (Web Exploitation)', state: 'running' }];

app.get('/api/vlan-profile', (req, res) => res.json(vlanProfile));
app.get('/api/nodes', (req, res) => res.json(nodes));
app.get('/api/scoreboard', (req, res) => res.json(scoreboard));
app.get('/api/events', (req, res) => res.json(events.slice(-50)));
app.get('/api/stacks', (req, res) => res.json(stacks));

app.post('/api/events', (req, res) => {
  const ev = { ...req.body, time: new Date().toISOString() };
  events.push(ev);
  if (ev.type === 'penalty') scoreboard.penalties += ev.value || -100;
  return res.status(201).json(ev);
});

app.post('/api/scoreboard/uptime', (req, res) => {
  scoreboard.uptime = req.body.uptime ?? scoreboard.uptime;
  res.json(scoreboard);
});

app.listen(4001, ()=> console.log('Light API running on :4001'));
