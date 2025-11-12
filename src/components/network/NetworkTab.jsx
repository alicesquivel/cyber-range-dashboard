import React, { useEffect, useState } from "react";
import { fetchNetworkFromScoreboard } from "../../api/scoreboard.js";
import { fetchHealth } from "../../api/telemetry.js";

// Extra info per node – Jake/Max can tweak this later.
const NODE_DETAILS = {
  "10.0.0.1": {
    hostname: "pi-router",
    role: "Router / Firewall",
    services: "DHCP, DNS, nftables",
  },
  "10.0.0.20": {
    hostname: "pi-dmz",
    role: "DMZ Web App",
    services: "FakeBank, future DVWA",
  },
  "10.0.0.30": {
    hostname: "pi-server",
    role: "Scoreboard + Registry",
    services: "FastAPI, local Docker registry",
  },
  "10.0.0.40": {
    hostname: "pi-client",
    role: "Client / Traffic Generator",
    services: "traffic scripts, attack tools",
  },
};

const statusBadgeClass = (status) => {
  if (status === "up") return "bg-emerald-500/10 text-emerald-400";
  if (status === "degraded") return "bg-amber-500/10 text-amber-400";
  if (status === "down") return "bg-rose-500/10 text-rose-400";
  return "bg-slate-700 text-slate-300";
};

export default function NetworkTab() {
  const [network, setNetwork] = useState([]);
  const [health, setHealth] = useState([]);

  useEffect(() => {
    fetchNetworkFromScoreboard().then(setNetwork);
    fetchHealth().then(setHealth);
  }, []);

  const healthByIp = Object.fromEntries(health.map((h) => [h.ip, h.status]));

  return (
    <div className="space-y-4">
      {/* Node table */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Nodes & VLANs
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Dummy telemetry for now. Later this will read from Jake&apos;s
              health.json and network.json exports.
            </p>
          </div>
          <p className="text-[11px] text-slate-400">Subnet 10.0.0.0/24</p>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-800">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-950/60 text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Node</th>
                <th className="px-3 py-2 text-left font-medium">IP / VLAN</th>
                <th className="px-3 py-2 text-left font-medium">Role</th>
                <th className="px-3 py-2 text-left font-medium">Services</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/60">
              {network.map((node) => {
                const status = healthByIp[node.ip] ?? "unknown";
                const details = NODE_DETAILS[node.ip] || {};
                return (
                  <tr key={node.ip}>
                    <td className="px-3 py-2 text-slate-100">
                      <div className="text-xs font-semibold">{node.name}</div>
                      {details.hostname && (
                        <div className="text-[11px] text-slate-400">
                          {details.hostname}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      <div>{node.ip}</div>
                      <div className="text-[11px] text-slate-500">
                        VLAN {node.vlan}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {details.role || "-"}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {details.services || "-"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide " +
                          statusBadgeClass(status)
                        }
                      >
                        {status === "up"
                          ? "Online"
                          : status === "degraded"
                          ? "Degraded"
                          : status === "down"
                          ? "Down"
                          : "Unknown"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {network.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-xs text-slate-500"
                  >
                    Loading node list…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Placeholder for future VLAN / ping tools */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">
          Network tools (coming soon)
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          This section is reserved for simple tools students can add later: ping
          tests, VLAN diagrams, or per-node telemetry panels.
        </p>
      </section>
    </div>
  );
}
