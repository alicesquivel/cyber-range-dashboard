import React, { useEffect, useState } from "react";
import { fetchScoreSummary, fetchEvents } from "../../api/scoreboard.js";
import { TEAM_CONFIG } from "../../content/dashboardContent.js";

const teamLabel = (teamKey) =>
  TEAM_CONFIG[teamKey]?.label || (teamKey ? `${teamKey} team` : "-");

const pointsClass = (points) =>
  points > 0
    ? "text-emerald-400"
    : points < 0
    ? "text-riskHigh"
    : "text-slate-300";

export default function ScoresTab() {
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchScoreSummary().then(setSummary);
    fetchEvents().then(setEvents);
  }, []);

  const total =
    summary?.uptime ??
    0 + (summary?.attackPenalties ?? 0) + (summary?.reportBonus ?? 0);

  return (
    <div className="space-y-4">
      {/* Score summary card */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">Score summary</h2>
        <p className="mt-1 text-xs text-slate-400">
          Score = uptime - attack penalties + report bonus. Dummy values for
          now; later this will mirror the official scoreboard.
        </p>

        {!summary && (
          <p className="mt-3 text-xs text-slate-500">Loading scores…</p>
        )}

        {summary && (
          <div className="mt-4 grid gap-y-1 text-xs text-slate-300 sm:grid-cols-[1fr_auto] sm:gap-y-2">
            <span>Uptime</span>
            <span className="text-right font-semibold text-slate-100">
              {summary.uptime}
            </span>

            <span>Attack penalties</span>
            <span className="text-right font-semibold text-riskHigh">
              {summary.attackPenalties}
            </span>

            <span>Report bonus</span>
            <span className="text-right font-semibold text-emerald-400">
              {summary.reportBonus}
            </span>

            <div className="mt-2 border-t border-slate-800 sm:col-span-2" />

            <span className="mt-2 text-sm font-semibold text-slate-100">
              Total
            </span>
            <span className="mt-2 text-right text-lg font-bold text-slate-50">
              {total}
            </span>
          </div>
        )}
      </section>

      {/* Event log table */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">Score events</h2>
        <p className="mt-1 text-xs text-slate-400">
          Each row represents a change to the score - either automatic (from
          scripts) or manual (from instructor decisions).
        </p>

        <div className="mt-3 overflow-hidden rounded-xl border border-slate-800">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-950/60 text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Time</th>
                <th className="px-3 py-2 text-left font-medium">Team</th>
                <th className="px-3 py-2 text-left font-medium">Change</th>
                <th className="px-3 py-2 text-left font-medium">Category</th>
                <th className="px-3 py-2 text-left font-medium">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/60">
              {events.map((e, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2 text-slate-300">{e.time}</td>
                  <td className="px-3 py-2 text-slate-300">
                    {teamLabel(e.team)}
                  </td>
                  <td
                    className={`px-3 py-2 font-semibold ${pointsClass(
                      e.points
                    )}`}
                  >
                    {e.points > 0 ? `+${e.points}` : e.points}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {e.category === "auto" ? "Automatic" : "Manual"}
                  </td>
                  <td className="px-3 py-2 text-slate-300">{e.note}</td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-xs text-slate-500"
                  >
                    No events loaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
