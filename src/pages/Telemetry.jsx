import Tabs from '../components/Tabs.jsx'
import RoleToggle from '../components/RoleToggle.jsx'
import { useState } from 'react'

export default function Telemetry() {
  const [tab, setTab] = useState("Telemetry")
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
      <div className="card p-5">
        <div className="text-lg font-semibold">Telemetry</div>
        <div className="text-slate-500 text-sm mt-1">Hook charts and logs here (Prometheus/Loki/Grafana or custom endpoints).</div>
      </div>
    </div>
  )
}
