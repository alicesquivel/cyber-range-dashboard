import Tabs from '../components/Tabs.jsx'
import RoleToggle from '../components/RoleToggle.jsx'
import { useState } from 'react'
import { stacks } from '../data/mock-adv.js'

const StackCard = ({ name, desc }) => (
  <div className="card p-5">
    <div className="text-lg font-semibold">{name}</div>
    <div className="text-sm text-slate-500">{desc}</div>
    <div className="mt-4 flex gap-2">
      <button className="px-3 py-2 rounded-lg bg-green-600 text-white">Start</button>
      <button className="px-3 py-2 rounded-lg border border-slate-300">Stop</button>
      <button className="px-3 py-2 rounded-lg border border-slate-300">Redeploy</button>
    </div>
  </div>
)

export default function Stacks() {
  const [tab, setTab] = useState("Stacks")
  const [role, setRole] = useState("Instructor")
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cyber Range-in-a-Box Dashboard</h1>
          <div className="text-slate-500">Manage Raspberry Pi nodes, VLANs, lab stacks, telemetry, and scoring.</div>
        </div>
        <RoleToggle value={role} onChange={setRole} />
      </div>
      <Tabs tabs={["Overview","Nodes & Network","Stacks","Telemetry"]} current={tab} onChange={setTab} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stacks.map((s,i)=> <StackCard key={i} name={s.name} desc={s.desc} />)}
      </div>

      <div className="card p-5">
        <div className="text-lg font-semibold mb-3">Control Panel</div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg bg-slate-900 text-white">Re-Image Nodes</button>
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white">Reset Range</button>
          <button className="px-4 py-2 rounded-lg border border-slate-300">Freeze Scoring</button>
        </div>
      </div>
    </div>
  )
}
