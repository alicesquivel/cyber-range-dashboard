import React, { useEffect, useState, useMemo, useCallback } from "react";
import { fetchNetworkFromScoreboard } from "../../api/scoreboard.js";
import { fetchHealth } from "../../api/telemetry.js";
import NodeDetailPanel from "./NodeDetailPanel.jsx";
import { getNodeDetails } from "../../content/networkNodes.js";
import InstructorTools from "../instructor/InstructorTools.jsx";
import SectionHeader from "../layout/SectionHeader";

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

export default function NetworkTab({ viewMode }) {
  const [network, setNetwork] = useState([]);
  const [health, setHealth] = useState([]);
  const [selectedIp, setSelectedIp] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [networkData, healthData] = await Promise.all([
          fetchNetworkFromScoreboard(),
          fetchHealth(),
        ]);

        if (!cancelled) {
          setNetwork(networkData);
          setHealth(healthData);
          setLastUpdated(new Date().toISOString());
        }
      } catch (err) {
        console.warn("NetworkTab polling error:", err);
      }
    }

    loadData();

    const intervalId = setInterval(loadData, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const healthByIp = useMemo(
    () => Object.fromEntries(health.map((h) => [h.ip, h.status])),
    [health]
  );
  const isInstructor = viewMode === "instructor";
  const handleClose = useCallback(() => setSelectedIp(null), []);

  const isLoading = network.length === 0;

  return (
    <div className="space-y-4">
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
          <div className="flex items-center gap-3">
            <p className="text-[11px] text-slate-400">Subnet 10.0.0.0/24</p>
            <div className="text-[11px] text-slate-500">
              {lastUpdated
                ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}`
                : null}
            </div>
            <button
              type="button"
              onClick={() => {
                // manual refresh
                try {
                  fetchNetworkFromScoreboard().then((d) => setNetwork(d));
                  fetchHealth().then((h) => setHealth(h));
                  setLastUpdated(new Date().toISOString());
                } catch (e) {
                  console.warn(e);
                }
              }}
              className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
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
                  //   <tr key={node.ip}>
                  <tr
                    key={node.ip}
                    className="cursor-pointer hover:bg-slate-800/70"
                    tabIndex={0}
                    role="button"
                    aria-label={`Open details for ${node.name} ${node.ip}`}
                    onClick={() => setSelectedIp(node.ip)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedIp(node.ip);
                      }
                    }}
                  >
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
                      <span className="ml-2 text-slate-400">›</span>
                    </td>
                  </tr>
                );
              })}
              {isLoading && (
                <>
                  {[1, 2, 3].map((i) => (
                    <tr key={`skeleton-${i}`}>
                      <td className="px-3 py-3">
                        <div className="h-3 w-32 animate-pulse rounded bg-slate-700" />
                        <div className="mt-2 h-2 w-20 animate-pulse rounded bg-slate-800" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-700" />
                        <div className="mt-2 h-2 w-12 animate-pulse rounded bg-slate-800" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="h-3 w-16 animate-pulse rounded bg-slate-700" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="h-3 w-20 animate-pulse rounded bg-slate-700" />
                      </td>
                      <td className="px-3 py-3">
                        <div className="h-3 w-12 animate-pulse rounded bg-slate-700" />
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Node detail panel - shared with Overview */}
      <NodeDetailPanel
        node={
          selectedIp ? network.find((n) => n.ip === selectedIp) ?? null : null
        }
        status={
          selectedIp
            ? health.find((h) => h.ip === selectedIp)?.status ?? "unknown"
            : "unknown"
        }
        viewMode={viewMode}
        onClose={handleClose}
      />

      {/* Instructor-only placeholder for future tools */}
      {isInstructor && <InstructorTools section="Network" />}
    </div>
  );
}
