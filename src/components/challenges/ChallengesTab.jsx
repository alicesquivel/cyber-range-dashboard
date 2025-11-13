// src/components/challenges/ChallengesTab.jsx
import React, { useState, useMemo, useEffect } from "react";
import { CHALLENGES, PACKS } from "./challengesContent.js";
import ChallengeDetailDrawer from "./ChallengeDetailDrawer.jsx";

const STORAGE_KEY = "crab_solved_challenges_v1";

const difficultyOrder = { easy: 0, medium: 1, hard: 2 };

function loadSolvedFromStorage() {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();

    const validIds = new Set(CHALLENGES.map((c) => c.id));
    return new Set(arr.filter((id) => validIds.has(id)));
  } catch {
    return new Set();
  }
}

function saveSolvedToStorage(solvedSet) {
  if (typeof window === "undefined") return;
  try {
    const arr = Array.from(solvedSet);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // ignore storage errors
  }
}

export default function ChallengesTab({ viewMode }) {
  const [selectedPack, setSelectedPack] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [activeChallengeId, setActiveChallengeId] = useState(null);

  // store solved IDs in a Set
  const [solvedSet, setSolvedSet] = useState(() => new Set());

  // load from localStorage on mount
  useEffect(() => {
    setSolvedSet(loadSolvedFromStorage());
  }, []);

  const isInstructor = viewMode === "instructor";

  const sortedChallenges = useMemo(() => {
    return [...CHALLENGES].sort((a, b) => {
      const packA = PACKS.find((p) => p.id === a.packId)?.name || "";
      const packB = PACKS.find((p) => p.id === b.packId)?.name || "";

      if (packA === packB) {
        const da = difficultyOrder[a.difficulty] ?? 99;
        const db = difficultyOrder[b.difficulty] ?? 99;
        if (da === db) return a.points - b.points;
        return da - db;
      }
      return packA.localeCompare(packB);
    });
  }, []);

  const visibleChallenges = sortedChallenges.filter((ch) => {
    if (selectedPack !== "all" && ch.packId !== selectedPack) return false;
    if (selectedDifficulty !== "all" && ch.difficulty !== selectedDifficulty)
      return false;
    return true;
  });

  const totalChallenges = CHALLENGES.length;
  const solvedCount = solvedSet.size;
  const progressPct =
    totalChallenges > 0 ? Math.round((solvedCount / totalChallenges) * 100) : 0;

  // per-pack stats for the tiny progress bars
  const packStats = useMemo(() => {
    const base = PACKS.map((p) => ({
      id: p.id,
      name: p.name,
      total: 0,
      solved: 0,
    }));
    const byId = Object.fromEntries(base.map((b) => [b.id, b]));

    CHALLENGES.forEach((ch) => {
      const stat = byId[ch.packId];
      if (!stat) return;
      stat.total += 1;
      if (solvedSet.has(ch.id)) stat.solved += 1;
    });

    return base;
  }, [solvedSet]);

  function handleMarkSolved(id) {
    setSolvedSet((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveSolvedToStorage(next);
      return next;
    });
  }

  function handleClearSolved(id) {
    setSolvedSet((prev) => {
      const next = new Set(prev);
      next.delete(id);
      saveSolvedToStorage(next);
      return next;
    });
  }

  const activeChallenge =
    CHALLENGES.find((c) => c.id === activeChallengeId) || null;

  return (
    <div className="space-y-4">
      {/* Role banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-xs text-slate-300">
        {isInstructor ? (
          <p>
            Instructor view - use this tab to track which challenges are solved,
            peek at artifacts, and test the flag submission flow before wiring a
            real backend.
          </p>
        ) : (
          <p>
            Student view - work through the challenges and mark them as solved
            as you go. This progress is stored only in this browser and does not
            affect the official scoreboard.
          </p>
        )}
      </div>

      {/* Progress summary + per-pack mini bars */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Challenge progress
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {solvedCount} of {totalChallenges} challenges marked as solved in
              this browser ({progressPct}%).
            </p>
          </div>
          <div className="text-[11px] text-slate-400">
            View mode:{" "}
            <span className="font-semibold text-slate-200">
              {isInstructor ? "Instructor" : "Student"}
            </span>
          </div>
        </div>

        <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-emerald-400"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* tiny per-pack bars */}
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {packStats.map((stat) => {
            if (!stat.total) return null;
            const pct =
              stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0;
            return (
              <div
                key={stat.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-200">
                    {stat.name}
                  </span>
                  <span className="text-slate-400">
                    {stat.solved}/{stat.total}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
                  <div
                    className="h-1.5 rounded-full bg-emerald-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col text-xs text-slate-300">
            <span className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Filter by pack
            </span>
            <select
              value={selectedPack}
              onChange={(e) => setSelectedPack(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            >
              <option value="all">All packs</option>
              {PACKS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col text-xs text-slate-300">
            <span className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Filter by difficulty
            </span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
            >
              <option value="all">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </section>

      {/* Challenge list */}
      <section className="space-y-4">
        {visibleChallenges.length === 0 && (
          <p className="text-xs text-slate-400">
            No challenges match the current filters.
          </p>
        )}

        {visibleChallenges.map((ch) => {
          const pack = PACKS.find((p) => p.id === ch.packId);
          const solved = solvedSet.has(ch.id);
          const isActive = activeChallengeId === ch.id;

          return (
            <React.Fragment key={ch.id}>
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-100">
                      {ch.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      ID:{" "}
                      <span className="font-mono lowercase text-slate-300">
                        {ch.id}
                      </span>{" "}
                      • {ch.category} • {ch.difficulty} • {ch.points} pts
                    </p>
                    {pack && (
                      <p className="text-[11px] text-slate-400">
                        Pack:{" "}
                        <span className="font-semibold text-slate-200">
                          {pack.name}
                        </span>
                      </p>
                    )}

                    {/* main summary */}
                    <p className="mt-1 text-xs text-slate-300">{ch.summary}</p>

                    {/* surface the student hint so it isn't hidden */}
                    {ch.studentHint && (
                      <p className="mt-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">
                          Hint for students:
                        </span>{" "}
                        {ch.studentHint}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
                    <span
                      className={
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
                        (solved
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-slate-700 text-slate-300")
                      }
                    >
                      {solved
                        ? "Solved in this browser"
                        : "Not yet solved here"}
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveChallengeId(ch.id)}
                      className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-900 hover:bg-slate-200"
                    >
                      {isActive ? "Hide details" : "View full details"}
                    </button>

                    {solved ? (
                      <button
                        type="button"
                        onClick={() => handleClearSolved(ch.id)}
                        className="text-[11px] text-slate-400 hover:text-slate-200"
                      >
                        Clear solved status
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMarkSolved(ch.id)}
                        className="text-[11px] text-slate-400 hover:text-slate-200"
                      >
                        Mark solved (local)
                      </button>
                    )}
                  </div>
                </div>
              </article>

              {/* inline detail drawer directly under this challenge */}
              {isActive && (
                <ChallengeDetailDrawer
                  challenge={ch}
                  viewMode={viewMode}
                  isSolved={solved}
                  onMarkSolved={() => handleMarkSolved(ch.id)}
                  onClearSolved={() => handleClearSolved(ch.id)}
                  onClose={() => setActiveChallengeId(null)}
                />
              )}
            </React.Fragment>
          );
        })}
      </section>

      {/* Detail drawer (artifacts, instructor notes, flag submission demo) */}
      <ChallengeDetailDrawer
        challenge={activeChallenge}
        viewMode={viewMode}
        isSolved={Boolean(activeChallenge && solvedSet.has(activeChallenge.id))}
        onMarkSolved={() =>
          activeChallenge && handleMarkSolved(activeChallenge.id)
        }
        onClearSolved={() =>
          activeChallenge && handleClearSolved(activeChallenge.id)
        }
        onClose={() => setActiveChallengeId(null)}
      />
    </div>
  );
}
