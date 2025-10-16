/**
 * Simple scoring poller:
 * - Adds +1 point to team "blue" each tick (uptime)
 * - Optionally posts a penalty event if a demo flag is seen
 * 
 * Usage:
 * SERVER_API=http://10.0.0.30:4001 DVWA_URL=http://10.0.0.20 node poller.js
 */
const API = process.env.SERVER_API || "http://10.0.0.30:4001";
const DVWA = process.env.DVWA_URL || "http://10.0.0.20";

async function addUptime(){
  try {
    const r = await fetch(`${API}/api/scoreboard/uptime`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ team: "blue", uptime: 1 })
    });
    await r.json();
  } catch (e) {
    // ignore errors to keep ticking
  }
}

async function maybePenalty(){
  // Placeholder: if a known path returns 200, post a penalty
  // You can change this to some "flag" condition in your labs.
  try {
    const r = await fetch(`${DVWA}/`);
    if (r.ok && Math.random() < 0.05) { // 5% random demo penalty
      await fetch(`${API}/api/events`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "Detected suspicious activity", value: -10 })
      });
    }
  } catch (e) {}
}

async function tick(){
  await addUptime();
  await maybePenalty();
}

console.log(`[poller] Ticking against API=${API} DVWA=${DVWA}`);
setInterval(tick, 3000);
