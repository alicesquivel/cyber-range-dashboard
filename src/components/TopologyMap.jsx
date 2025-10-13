// Placeholder visual map for VLAN segments and roles
export default function TopologyMap() {
  return (
    <div className="card p-5">
      <div className="text-lg font-semibold mb-3">Range Topology (VLAN Segments)</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "OPNsense Router", subtitle: "White Team / Mgmt" },
          { title: "DMZ", subtitle: "DVWA, DNS" },
          { title: "Server", subtitle: "Files, Internal APIs" },
          { title: "Client", subtitle: "Blue Team Workstations" },
          { title: "Simulated Internet", subtitle: "Red/Yellow Agents" },
          { title: "Local Registry", subtitle: "Container Images" },
          { title: "Scoring UI", subtitle: "Uptime / Penalties / Reports" },
          { title: "Telemetry", subtitle: "Firewall & Host Logs" }
        ].map((b, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-4 bg-white">
            <div className="font-medium">{b.title}</div>
            <div className="text-xs text-slate-500 mt-1">{b.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
