import { useEffect, useState } from "react";
import { getScores, addScore, postPenalty, getNodes, health } from "./lib/api.js";

export default function App(){
  const [scores,setScores]=useState({});
  const [team,setTeam]=useState("blue");
  const [pts,setPts]=useState(10);
  const [h,setH]=useState({api:false,dmz:false});
  const [nodes,setNodes]=useState([]);
  const [title,setTitle]=useState("Policy Violation");
  const [pen,setPen]=useState(-25);
  const [busy,setBusy]=useState(false);

  async function refresh(){
    try{
      const [s, n, hh] = await Promise.all([getScores(), getNodes(), health()]);
      setScores(s); setNodes(n); setH(hh);
    }catch(e){
      console.error(e);
    }
  }
  useEffect(()=>{ refresh(); },[]);

  const add = async ()=>{
    setBusy(true);
    try{
      await addScore(team, Number(pts||0));
      await refresh();
    }finally{ setBusy(false); }
  };

  const penalty = async ()=>{
    setBusy(true);
    try{
      await postPenalty(title, Number(pen||-10));
      await refresh();
    }finally{ setBusy(false); }
  };

  return (
    <div className="wrap">
      <h1>Cyber Range Dashboard</h1>
      <div className="row" style={{marginBottom:12}}>
        <span className="kpi">API: <b className={h.api?"ok":"bad"}>{h.api?"OK":"DOWN"}</b></span>
        <span className="kpi">DMZ: <b className={h.dmz?"ok":"bad"}>{h.dmz?"OK":"DOWN"}</b></span>
        <button className="btn" onClick={refresh}>Recheck</button>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <h3>Scoreboard</h3>
        <div className="row" style={{marginBottom:8}}>
          <input value={team} onChange={e=>setTeam(e.target.value)} placeholder="team name (e.g., blue)" />
          <input type="number" value={pts} onChange={e=>setPts(e.target.value)} style={{width:120}} />
          <button className="btn" disabled={busy} onClick={add}>+ Add Points</button>
        </div>
        <table>
          <thead><tr><th>Team</th><th>Points</th></tr></thead>
          <tbody>
            {Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([k,v])=>(
              <tr key={k}><td>{k}</td><td><b>{v}</b></td></tr>
            ))}
            {Object.keys(scores).length===0 && (<tr><td colSpan="2">No scores yet.</td></tr>)}
          </tbody>
        </table>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <h3>Penalty / Event</h3>
        <div className="row" style={{marginBottom:8}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="event title" />
          <input type="number" value={pen} onChange={e=>setPen(e.target.value)} style={{width:120}} />
          <button className="btn" disabled={busy} onClick={penalty}>Post Penalty</button>
        </div>
      </div>

      <div className="card">
        <h3>Nodes</h3>
        <table>
          <thead><tr><th>Name</th><th>IP</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            {nodes.map(n=>(<tr key={n.ip}><td>{n.name}</td><td>{n.ip}</td><td>{n.role}</td><td>{n.status}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
