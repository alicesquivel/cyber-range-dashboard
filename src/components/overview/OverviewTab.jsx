import React, { useEffect, useState } from "react";
import NodeDetailPanel from "../network/NodeDetailPanel.jsx";

import {
  fetchScores,
  fetchNetworkFromScoreboard,
} from "../../api/scoreboard.js";
import { fetchHealth, fetchMetrics } from "../../api/telemetry.js";
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

export default function OverviewTab({ viewMode }) {
  const [scores, setScores] = useState({});
  const [network, setNetwork] = useState([]);
  const [health, setHealth] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [selectedIp, setSelectedIp] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [scoresData, networkData, healthData, metricsData] =
          await Promise.all([
            fetchScores(),
            fetchNetworkFromScoreboard(),
            fetchHealth(),
            fetchMetrics(),
          ]);

        if (!cancelled) {
          setScores(scoresData);
          setNetwork(networkData);
          setHealth(healthData);
          setMetrics(metricsData);
        }
      } catch (err) {
        console.warn("OverviewTab polling error:", err);
      }
    }

    // initial load
    loadData();

    // poll every 5 seconds
    const intervalId = setInterval(loadData, 5000);

    // cleanup on unmount
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const healthByIp = Object.fromEntries(health.map((h) => [h.ip, h.status]));
  const metricsByIp = Object.fromEntries(metrics.map((m) => [m.ip, m]));
  const teamKeys = Object.keys(scores);

  const isInstructor = viewMode === "instructor";

  return (
    <div className="space-y-4">
      {/* Role-specific banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-300">
        {isInstructor ? (
          <p>
            Instructor view - use this page during labs to quickly verify that
            all nodes are online and that team scores are moving as expected.
          </p>
        ) : (
          <p>
            Student view - keep an eye on your team&apos;s readiness and the
            status of each range node while you work through the labs.
          </p>
        )}
      </div>

      {/* Network summary */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">Network map</h2>
          <p className="text-[11px] text-slate-400">Subnet 10.0.0.0/24</p>
        </div>
        {isInstructor && (
          <p className="mt-1 text-[11px] text-slate-400">
            In instructor view you can see the same node status that students
            see. Later we can add per-node drill down or quick diagnostics here.
          </p>
        )}

        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {network.map((node) => {
            const status = healthByIp[node.ip] ?? "unknown";
            return (
              <div
                key={node.ip}
                onClick={() => setSelectedIp(node.ip)}
                className="flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 hover:border-primary/60 hover:bg-slate-900"
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
          Readiness converts the current score into a simple 0 to 100 scale.
          This formula can be updated later once the scoring rubric is final.
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

      {/* Node details side panel */}
      <NodeDetailPanel
        node={
          selectedIp ? network.find((n) => n.ip === selectedIp) ?? null : null
        }
        status={
          selectedIp
            ? health.find((h) => h.ip === selectedIp)?.status ?? "unknown"
            : "unknown"
        }
        metrics={selectedIp ? metricsByIp[selectedIp] ?? null : null}
        viewMode={viewMode}
        onClose={() => setSelectedIp(null)}
      />
    </div>
  );
}
