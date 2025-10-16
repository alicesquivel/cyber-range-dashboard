const API = import.meta.env.VITE_API_URL || "http://10.0.0.30:4001";
const DMZ = import.meta.env.VITE_DMZ_URL || "http://10.0.0.20";

async function j(res){ if(!res.ok) throw new Error(`${res.status} ${res.statusText}`); return res.json(); }

export const getScores = async () => (await j(await fetch(`${API}/api/scoreboard`,{cache:"no-store"}))).scores;
export const addScore = async (team, pts) => j(await fetch(`${API}/api/scoreboard/add/${encodeURIComponent(team)}/${pts}`, {method:"POST"}));
export const postPenalty = async (title, value) => j(await fetch(`${API}/api/events`, {method:"POST", headers:{'content-type':'application/json'}, body:JSON.stringify({title,value})})));
export const getNodes = async () => (await j(await fetch(`${API}/api/nodes`, {cache:"no-store"}))).nodes;

export async function health(){
  const api = await fetch(`${API}/api/health`).then(r=>r.ok).catch(()=>false);
  // DMZ check: no-cors GET to allow simple reachability without errors in offline mode
  const dmz = await fetch(`${DMZ}/`, {mode:"no-cors"}).then(()=>true).catch(()=>false);
  return { api, dmz };
}
