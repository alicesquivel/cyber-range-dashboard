// src/components/scores/TeamLeaderboard.jsx
import React, { useEffect, useState } from "react";
import Skeleton from "../ui/Skeleton.jsx";
import Card from "../ui/Card.jsx";
import { fetchScores } from "../../api/scoreboard.js";
import { TEAM_CONFIG } from "../../content/dashboardContent.js";

export default function TeamLeaderboard({ viewMode }) {
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchScores();
        if (!cancelled) setScores(data || {});
        if (!cancelled) setLastUpdated(new Date().toISOString());
      } catch (err) {
        console.warn("TeamLeaderboard error:", err);
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

  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const isInstructor = viewMode === "instructor";

  return (
    <Card as="section">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Team leaderboard
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Live view of team scores from the scoreboard API (dummy for now).
          </p>
        </div>
        {isInstructor && (
          <p className="text-[11px] text-slate-500">
            Instructor tip: use this at the end of lab to highlight top teams.
          </p>
        )}
      </div>

      {loading && (
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              as="div"
              key={i}
              className="flex flex-col px-3 py-3 bg-slate-950/70"
              aria-hidden
            >
              <Skeleton width="w-24" height="h-4" className="bg-slate-700" />
              <div className="mt-3">
                <Skeleton width="w-20" height="h-8" className="bg-slate-800" />
              </div>
              <div className="mt-2">
                <Skeleton
                  width="w-full"
                  height="h-2"
                  className="bg-slate-800"
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <p className="mt-3 text-xs text-slate-400">
          No scores yet. Once the scoreboard backend is wired in, team scores
          will appear here.
        </p>
      )}

      {!loading && entries.length > 0 && (
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          {entries.map(([key, pts], index) => {
            const cfg = TEAM_CONFIG[key] || {
              label: key,
              colorClass: "text-slate-200",
            };
            const place =
              index === 0
                ? "1st"
                : index === 1
                ? "2nd"
                : index === 2
                ? "3rd"
                : `${index + 1}th`;

            return (
              <Card
                as="div"
                key={key}
                className="flex flex-col px-3 py-3 bg-slate-950/70"
                tabIndex={0}
                role="group"
                aria-label={`${cfg.label} ${pts} points`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-semibold ${cfg.colorClass}`}>
                    {cfg.label}
                  </h3>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                    {place}
                  </span>
                </div>
                <p className="mt-2 text-xl font-semibold text-slate-50">
                  {pts}
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    pts
                  </span>
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-slate-50"
                    style={{
                      width: `${Math.min(
                        100,
                        (pts / (entries[0][1] || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Card>
  );
}
