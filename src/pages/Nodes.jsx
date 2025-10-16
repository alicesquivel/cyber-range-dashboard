import Tabs from '../components/Tabs.jsx'
import RoleToggle from '../components/RoleToggle.jsx'
import Badge from '../components/Badge.jsx'
import { useState } from 'react'
import { nodes } from '../data/mock-adv.js'

export default function Nodes() {
  const [tab, setTab] = useState("Nodes & Network")
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
        <div className="text-lg font-semibold mb-3">Nodes & VLANs</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 pr-4">Node</th>
                <th className="py-2 pr-4">IP</th>
                <th className="py-2 pr-4">VLAN</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">CPU%</th>
                <th className="py-2 pr-4">Temp °C</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((n,i)=>(
                <tr key={i} className="border-t border-slate-100">
                  <td className="py-2 pr-4">{n.name}</td>
                  <td className="py-2 pr-4">{n.ip}</td>
                  <td className="py-2 pr-4">{n.vlan}</td>
                  <td className="py-2 pr-4"><Badge tone={n.status==='Warning'?'warning':'success'}>{n.status}</Badge></td>
                  <td className="py-2 pr-4">{n.cpu}</td>
                  <td className="py-2 pr-4">{n.temp}</td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded-lg border border-slate-300">SSH</button>
                      <button className="px-2 py-1 rounded-lg bg-slate-900 text-white">Reboot</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
