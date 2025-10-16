import RoleToggle from '../components/RoleToggle.jsx'
import Tabs from '../components/Tabs.jsx'
import Progress from '../components/Progress.jsx'
import Badge from '../components/Badge.jsx'
import Modal from '../components/Modal.jsx'
import { useState } from 'react'
import { vlanProfile, scoreboard, readiness } from '../data/mock-adv.js'

const NetworkCard = ({ title, ip, vlan }) => (
  <div className="border border-slate-200 rounded-xl p-5 bg-white">
    <div className="text-lg font-medium">{title}</div>
    <div className="text-sm text-slate-500 mt-1">{ip} • VLAN {vlan}</div>
    <div className="mt-3"><Badge tone="info">Shielded</Badge></div>
  </div>
)

const ScoreTable = () => {
  const total = scoreboard.uptime + scoreboard.penalties + scoreboard.bonus
  return (
    <div className="card p-5">
      <div className="text-lg font-semibold mb-3">Scoreboard</div>
      <table className="min-w-full text-sm">
        <tbody>
          <tr><td className="py-1 pr-4">Uptime</td><td className="py-1 text-right">{scoreboard.uptime}</td></tr>
          <tr><td className="py-1 pr-4">Attack Penalties</td><td className="py-1 text-right text-red-600">{scoreboard.penalties}</td></tr>
          <tr><td className="py-1 pr-4">Report Bonus</td><td className="py-1 text-right text-green-600">+{scoreboard.bonus}</td></tr>
          <tr className="border-t border-slate-200"><td className="py-2 pr-4 font-medium">Total</td><td className="py-2 text-right font-semibold">{total}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

const TeamCard = ({ name, pct }) => (
  <div className="card p-5">
    <div className="text-base font-semibold mb-3">{name}</div>
    <Progress value={pct} />
    <div className="text-xs text-slate-500 mt-2">{pct}% readiness</div>
  </div>
)

export default function Overview() {
  const [tab, setTab] = useState("Overview")
  const [role, setRole] = useState("Student")
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState({ ...vlanProfile })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cyber Range-in-a-Box Dashboard</h1>
          <div className="text-slate-500">Manage Raspberry Pi nodes, VLANs, lab stacks, telemetry, and scoring.</div>
        </div>
        <RoleToggle value={role} onChange={setRole} />
      </div>

      <div className="flex items-center justify-between">
        <Tabs tabs={["Overview","Nodes & Network","Stacks","Telemetry"]} current={tab} onChange={setTab} />
        <button onClick={() => setOpen(true)} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">
          VLAN Config
        </button>
      </div>

      <div className="card p-5">
        <div className="text-lg font-semibold mb-3">Network Map</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <NetworkCard title="DMZ" ip="10.10.10.10" vlan={profile.dmz} />
          <NetworkCard title="Server" ip="10.20.20.20" vlan={profile.server} />
          <NetworkCard title="Client" ip="10.30.30.30" vlan={profile.client} />
          <NetworkCard title="Simulated Internet" ip="198.51.100.5" vlan={profile.internet} />
          <NetworkCard title="Router (OPNsense)" ip="10.0.0.1" vlan={1} />
        </div>
      </div>

      <ScoreTable />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {readiness.map((r, i) => <TeamCard key={i} name={r.team} pct={r.pct} />)}
      </div>

      <div className="card p-5">
        <div className="text-lg font-semibold mb-3">Control Panel</div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg bg-slate-900 text-white">Re-Image Nodes</button>
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white">Reset Range</button>
          <button className="px-4 py-2 rounded-lg border border-slate-300">Freeze Scoring</button>
        </div>
      </div>

      <Modal open={open} title="VLAN Configuration" onClose={() => setOpen(false)}>
        <form className="grid grid-cols-2 gap-4" onSubmit={e => e.preventDefault()}>
          <label className="text-sm">
            DMZ VLAN
            <input value={profile.dmz} onChange={e=>setProfile({...profile, dmz:e.target.value})}
                   className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
          </label>
          <label className="text-sm">
            Server VLAN
            <input value={profile.server} onChange={e=>setProfile({...profile, server:e.target.value})}
                   className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
          </label>
          <label className="text-sm">
            Client VLAN
            <input value={profile.client} onChange={e=>setProfile({...profile, client:e.target.value})}
                   className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
          </label>
          <label className="text-sm">
            Simulated Internet VLAN
            <input value={profile.internet} onChange={e=>setProfile({...profile, internet:e.target.value})}
                   className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
          </label>
        </form>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={()=>setOpen(false)} className="px-3 py-2 rounded-lg border border-slate-300">Cancel</button>
          <button onClick={()=>setOpen(false)} className="px-3 py-2 rounded-lg bg-slate-900 text-white">Save Profile</button>
        </div>
      </Modal>
    </div>
  )
}
