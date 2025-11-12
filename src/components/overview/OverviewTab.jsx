import React, { useEffect, useState } from "react";
import {
  fetchScores,
  fetchNetworkFromScoreboard,
} from "../../api/scoreboard.js";
import { fetchHealth } from "../../api/telemetry.js";
import {
  TEAM_CONFIG,
  pointsToReadiness,
} from "../../content/dashboardContent.js";

const statusClass = (status) => {
  if (status === "up") return "bg-emerald-500/10 text-emerald-400";
  if (status === "degraded") return "bg-amber-500/10 text-amber-400";
  if (status === "down") return "bg-rose-500/10 text-rose-400";
  return "bg-slate-700 text-slate-300";
};

export default function OverviewTab() {
  const [scores, setScores] = useState({});
  const [network, setNetwork] = useState([]);
  const [health, setHealth] = useState([]);

  useEffect(() => {
    fetchScores().then(setScores);
    fetchNetworkFromScoreboard().then(setNetwork);
    fetchHealth().then(setHealth);
  }, []);

  const healthByIp = Object.fromEntries(health.map((h) => [h.ip, h.status]));
  const teamKeys = Object.keys(scores);

  return (
    <div className="space-y-4">
      {/* Network cards */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Network map</h2>
          <p className="text-[11px] text-slate-400">Subnet 10.0.0.0/24</p>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {network.map((node) => {
            const status = healthByIp[node.ip] ?? "unknown";
            return (
              <div
                key={node.ip}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    {node.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {node.ip} • VLAN {node.vlan}
                  </p>
                </div>
                <div className="mt-3 text-[10px]">
                  <span
                    className={
                      "inline-flex rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide " +
                      statusClass(status)
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
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team readiness */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">Team readiness</h2>
        <p className="mt-1 text-xs text-slate-400">
          Dummy values for now; later this will be live from the scoreboard API.
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {teamKeys.length === 0 && (
            <p className="text-xs text-slate-500">Waiting for scores…</p>
          )}

          {teamKeys.map((key) => {
            const cfg = TEAM_CONFIG[key] || {
              label: key,
              colorClass: "text-slate-200",
            };
            const pts = scores[key];
            const pct = pointsToReadiness(pts);

            return (
              <div
                key={key}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/60 p-3"
              >
                <h3 className={`text-sm font-semibold ${cfg.colorClass}`}>
                  {cfg.label}
                </h3>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-slate-50"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {pts} pts • {pct}% readiness
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
