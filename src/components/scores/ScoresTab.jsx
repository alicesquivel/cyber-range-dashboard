// src/components/scores/ScoresTab.jsx
import React, { useEffect, useState, useMemo } from "react";
import Skeleton from "../ui/Skeleton.jsx";
import { fetchScoreSummary, fetchScoreEvents } from "../../api/scoreboard.js";
import TeamLeaderboard from "./TeamLeaderboard.jsx";

function deltaClass(delta) {
  if (delta > 0) return "text-emerald-400";
  if (delta < 0) return "text-rose-400";
  return "text-slate-200";
}

export default function ScoresTab({ viewMode }) {
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isInstructor = viewMode === "instructor";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [s, e] = await Promise.all([
          fetchScoreSummary(),
          fetchScoreEvents(),
        ]);
        if (!cancelled) {
          setSummary(s);
          setEvents(e || []);
          setLastUpdated(new Date().toISOString());
        }
      } catch (err) {
        console.warn("ScoresTab error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 5000); // poll every 5s

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-300">
        {isInstructor ? (
          <p>
            Instructor view - use this tab to track how uptime, attack
            penalties, and incident reports affect each team&apos;s score.
            Later, this will reflect the real Raspberry Pi scoreboard.
          </p>
        ) : (
          <p>
            Student view - scores are based on uptime, attack penalties, and any
            bonus points your team earns for good incident reporting.
          </p>
        )}
      </section>

      {/* Leaderboard */}
      <TeamLeaderboard viewMode={viewMode} />

      {/* Score summary */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">Score summary</h2>
        <p className="mt-1 text-xs text-slate-400">
          Score = uptime − attack penalties + report bonus. These values are
          dummy data for now; later they will mirror the official scoreboard.
        </p>

        {loading && (
          <div className="mt-3 space-y-2">
            <Skeleton width="w-48" height="h-4" className="bg-slate-700" />
            <Skeleton width="w-32" height="h-6" className="bg-slate-800" />
          </div>
        )}

        {!loading && summary && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center justify-between gap-4">
                  <span>Uptime</span>
                  <span className="font-mono text-slate-50">
                    {summary.uptime}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Attack penalties</span>
                  <span className="font-mono text-rose-400">
                    {summary.penalties}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Report bonus</span>
                  <span className="font-mono text-emerald-400">
                    {summary.reportBonus}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-xs text-slate-400">Total score</p>
                <p className="text-3xl font-semibold text-slate-50">
                  {summary.total}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Score events */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">Score events</h2>
        <p className="mt-1 text-xs text-slate-400">
          Each row represents a change to the score - either automatic (from
          scripts) or manual (from instructor decisions).
        </p>

        {loading && (
          <div className="mt-3 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton width="w-24" height="h-3" className="bg-slate-700" />
                <Skeleton width="w-32" height="h-3" className="bg-slate-800" />
                <Skeleton width="w-12" height="h-3" className="bg-slate-700" />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
            <table className="min-w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Team</th>
                  <th className="px-4 py-2">Change</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, idx) => (
                  <tr
                    key={idx}
                    tabIndex={0}
                    role="row"
                    aria-label={`${e.time} ${e.team} change ${e.delta}`}
                    className={
                      idx % 2 === 0 ? "bg-slate-950/80" : "bg-slate-900/80"
                    }
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter") {
                        /* noop for now; could open detail */
                      }
                    }}
                  >
                    <td className="px-4 py-2 font-mono text-[11px] text-slate-400">
                      {e.time}
                    </td>
                    <td className="px-4 py-2">{e.team}</td>
                    <td
                      className={`px-4 py-2 font-mono ${deltaClass(e.delta)}`}
                    >
                      {e.delta > 0 ? `+${e.delta}` : e.delta}
                    </td>
                    <td className="px-4 py-2">{e.category}</td>
                    <td className="px-4 py-2 text-slate-300">{e.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
