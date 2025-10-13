import fetch from 'node-fetch';
const SERVER = process.env.SERVER_API || 'http://10.20.20.20:4001';
const DVWA = process.env.DVWA_URL || 'http://localhost';

async function postUptime(u) {
  await fetch(`${SERVER}/api/scoreboard/uptime`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ uptime: u })
  }).catch(()=>{});
}

async function postPenalty(reason, value=-120) {
  await fetch(`${SERVER}/api/events`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type: 'penalty', title: reason, value })
  }).catch(()=>{});
}

async function check() {
  try {
    const r = await fetch(`${DVWA}/`);
    if (r.ok) {
      await postUptime( (Math.random()*20|0) + 900 );
    } else {
      await postUptime(0);
    }
  } catch(e) {
    await postUptime(0);
  }
}

async function watchForSQLi() {
  try {
    const r = await fetch(`${DVWA}/sqli_test_flag`);
    if (r.ok) {
      await postPenalty('Blocked SQLi attempt (demo)', -120);
    }
  } catch(e){}
}

setInterval(check, 10000);
setInterval(watchForSQLi, 5000);
console.log('scoring poller running');
