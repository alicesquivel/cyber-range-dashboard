import React, { useEffect, useState } from "react";
import { fetchScoreSummary, fetchEvents } from "../../api/scoreboard.js";
import { TEAM_CONFIG } from "../../content/dashboardContent.js";
import InstructorTools from "../instructor/InstructorTools.jsx";

const teamLabel = (teamKey) =>
  TEAM_CONFIG[teamKey]?.label || (teamKey ? `${teamKey} team` : "-");

const pointsClass = (points) =>
  points > 0
    ? "text-emerald-400"
    : points < 0
    ? "text-riskHigh"
    : "text-slate-300";

export default function ScoresTab({ viewMode }) {
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [summaryData, eventsData] = await Promise.all([
          fetchScoreSummary(),
          fetchEvents(),
        ]);

        if (!cancelled) {
          setSummary(summaryData);
          setEvents(eventsData);
        }
      } catch (err) {
        console.warn("ScoresTab polling error:", err);
      }
    }

    loadData();

    const intervalId = setInterval(loadData, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const total =
    (summary?.uptime ?? 0) +
    (summary?.attackPenalties ?? 0) +
    (summary?.reportBonus ?? 0);

  const isInstructor = viewMode === "instructor";

  return (
    <div className="space-y-4">
      {/* Score summary card */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">Score summary</h2>
        <p className="mt-1 text-xs text-slate-400">
          Score = uptime - attack penalties + report bonus. Dummy values for
          now; later this will mirror the official scoreboard on the Server Pi.
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

      {/* Event log - visible to both, but instructors get extra context */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">Score events</h2>
        <p className="mt-1 text-xs text-slate-400">
          Each row represents a change to the score - either automatic from
          scripts or manual from instructor decisions.
        </p>
        {isInstructor && (
          <p className="mt-1 text-[11px] text-slate-400">
            Instructor note: this table should match the official log that
            explains why points changed so that students can review after the
            exercise.
          </p>
        )}

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

      {/* Instructor-only future controls */}
      {isInstructor && <InstructorTools section="Scores" />}
    </div>
  );
}
