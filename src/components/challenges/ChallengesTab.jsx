// src/components/challenges/ChallengesTab.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import StatusBadge from "../ui/StatusBadge.jsx";
import Card from "../ui/Card.jsx";
import { CHALLENGES, PACKS } from "./challengesContent.js";
import ChallengeDetailDrawer from "./ChallengeDetailDrawer.jsx";

const SOLVED_STORAGE_KEY = "crab_solved_challenges_v1";
const STATUS_STORAGE_KEY = "crab_challenge_status_overrides_v1";

const difficultyOrder = { easy: 0, medium: 1, hard: 2 };

// -------- localStorage helpers --------

function loadSolvedFromStorage() {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.localStorage.getItem(SOLVED_STORAGE_KEY);
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
    window.localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // ignore
  }
}

function loadStatusOverridesFromStorage() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STATUS_STORAGE_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return {};
    return obj;
  } catch {
    return {};
  }
}

function saveStatusOverridesToStorage(overrides) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

// base status from content + override map
function getEffectiveStatus(challenge, overrides) {
  return overrides[challenge.id] || challenge.status || "available";
}

// small difficulty dot indicator
function DifficultyDots({ level }) {
  let filled = 0;
  if (level === "easy") filled = 1;
  else if (level === "medium") filled = 2;
  else if (level === "hard") filled = 3;

  return (
    <div className="flex items-center gap-1 text-[10px]">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={
            "inline-block h-1.5 w-1.5 rounded-full " +
            (i <= filled ? "bg-emerald-400" : "bg-slate-600")
          }
        />
      ))}
      <span className="capitalize text-slate-400">{level}</span>
    </div>
  );
}

function statusBadgeStyles(status) {
  if (status === "available") {
    return {
      label: "Available",
      className: "bg-emerald-500/10 text-emerald-300",
    };
  }
  if (status === "locked") {
    return {
      label: "Locked",
      className: "bg-amber-500/10 text-amber-300",
    };
  }
  if (status === "hidden") {
    return {
      label: "Hidden from students",
      className: "bg-rose-500/10 text-rose-300",
    };
  }
  return {
    label: "Status unknown",
    className: "bg-slate-700 text-slate-300",
  };
}

export default function ChallengesTab({ viewMode }) {
  const [selectedPack, setSelectedPack] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [solvedSet, setSolvedSet] = useState(() => new Set());
  const [statusOverrides, setStatusOverrides] = useState(() => ({}));
  const [previewAsStudent, setPreviewAsStudent] = useState(false);

  const isInstructor = viewMode === "instructor";
  const effectiveViewMode =
    isInstructor && previewAsStudent ? "student" : viewMode;
  const isStudentView = effectiveViewMode === "student";

  // load stored state
  useEffect(() => {
    setSolvedSet(loadSolvedFromStorage());
    setStatusOverrides(loadStatusOverridesFromStorage());
  }, []);

  // sorted challenges (deterministic order)
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

  // filter by pack/difficulty + status (student view hides hidden)
  const visibleChallenges = sortedChallenges.filter((ch) => {
    const status = getEffectiveStatus(ch, statusOverrides);

    if (selectedPack !== "all" && ch.packId !== selectedPack) return false;
    if (selectedDifficulty !== "all" && ch.difficulty !== selectedDifficulty)
      return false;

    if (isStudentView && status === "hidden") return false;

    return true;
  });

  const totalChallenges = CHALLENGES.length;
  const solvedCount = solvedSet.size;
  const progressPct =
    totalChallenges > 0 ? Math.round((solvedCount / totalChallenges) * 100) : 0;

  // per-pack solved stats
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

  function handleSetStatusOverride(id, status) {
    setStatusOverrides((prev) => {
      const next = { ...prev };
      if (status === "reset") {
        delete next[id];
      } else {
        next[id] = status;
      }
      saveStatusOverridesToStorage(next);
      return next;
    });
  }

  const activeChallenge =
    CHALLENGES.find((c) => c.id === activeChallengeId) || null;

  return (
    <Card className="space-y-4">
      {/* Role banner */}
      <Card className="bg-slate-950/70 px-4 py-3 text-xs text-slate-300 shadow-none">
        {isInstructor ? (
          <p>
            Instructor view. Use this tab to manage challenge visibility
            (available, locked, hidden), review artifacts, and test flag
            submission. Status controls are local to this browser for now and do
            not change the backend.
          </p>
        ) : (
          <p>
            Student view. Work through the challenges and mark them as solved as
            you go. Local progress and status behavior here does not affect the
            official scoreboard.
          </p>
        )}
      </Card>

      {/* Progress summary + per-pack bars + preview toggle */}
      <Card as="section">
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

          <div className="flex flex-col items-start gap-1 text-[11px] text-slate-400 sm:items-end">
            <div>
              View mode:{" "}
              <span className="font-semibold text-slate-200">
                {isInstructor
                  ? previewAsStudent
                    ? "Instructor (previewing student)"
                    : "Instructor"
                  : "Student"}
              </span>
            </div>
            {isInstructor && (
              <button
                type="button"
                onClick={() => setPreviewAsStudent((prev) => !prev)}
                className="mt-1 rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-200 hover:border-slate-400"
              >
                {previewAsStudent
                  ? "Show instructor view"
                  : "Preview as student"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-emerald-400"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {packStats.map((stat) => {
            if (!stat.total) return null;
            const pct =
              stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0;
            return (
              <Card
                key={stat.id}
                as="div"
                className="rounded-xl bg-slate-950/70 px-3 py-2 shadow-none"
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
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <Card as="section">
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
      </Card>

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

          const effectiveStatus = getEffectiveStatus(ch, statusOverrides);
          const statusInfo = statusBadgeStyles(effectiveStatus);
          const isLockedForStudent =
            isStudentView && effectiveStatus === "locked";

          return (
            <React.Fragment key={ch.id}>
              <Card as="article" className="bg-slate-900/70">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* left side */}
                  <div
                    className="space-y-1"
                    tabIndex={0}
                    role="button"
                    aria-label={`Open challenge details for ${ch.title} ${ch.id}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setActiveChallengeId((prev) =>
                          prev === ch.id ? null : ch.id
                        );
                      }
                    }}
                  >
                    <h3 className="text-sm font-semibold text-slate-100">
                      {ch.title}
                    </h3>

                    <p className="text-[11px] text-slate-400">
                      ID:{" "}
                      <span className="font-mono lowercase text-slate-300">
                        {ch.id}
                      </span>{" "}
                      • {ch.category} • {ch.points} pts
                    </p>

                    {pack && (
                      <p className="text-[11px] text-slate-400">
                        Pack:{" "}
                        <span className="font-semibold text-slate-200">
                          {pack.name}
                        </span>
                      </p>
                    )}

                    <DifficultyDots level={ch.difficulty} />

                    {ch.summary && (
                      <p className="mt-1 text-xs text-slate-300">
                        {ch.summary}
                      </p>
                    )}
                  </div>

                  {/* right side: status, solved, controls */}
                  <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
                    {/* availability status */}
                    <StatusBadge status={effectiveStatus}>
                      {statusInfo.label}
                    </StatusBadge>

                    {/* solved status */}
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

                    {/* details button */}
                    <button
                      type="button"
                      disabled={isLockedForStudent}
                      onClick={() => {
                        if (isLockedForStudent) return;
                        setActiveChallengeId(isActive ? null : ch.id);
                      }}
                      className={
                        "rounded-full px-3 py-1 text-[11px] font-semibold " +
                        (isLockedForStudent
                          ? "cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-400"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200")
                      }
                    >
                      {isLockedForStudent
                        ? "Locked"
                        : isActive
                        ? "Hide details"
                        : "View full details"}
                    </button>

                    {/* solved toggle */}
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

                    {/* instructor status controls */}
                    {isInstructor && (
                      <div className="mt-1 flex flex-wrap items-center justify-end gap-1 text-[10px] text-slate-400">
                        <span className="mr-1">Status controls:</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleSetStatusOverride(ch.id, "available")
                          }
                          className="rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 hover:border-emerald-400"
                        >
                          Set available
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleSetStatusOverride(ch.id, "locked")
                          }
                          className="rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 hover:border-amber-400"
                        >
                          Lock
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleSetStatusOverride(ch.id, "hidden")
                          }
                          className="rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 hover:border-rose-400"
                        >
                          Hide from students
                        </button>
                        {statusOverrides[ch.id] && (
                          <button
                            type="button"
                            onClick={() =>
                              handleSetStatusOverride(ch.id, "reset")
                            }
                            className="ml-1 text-[10px] text-slate-400 underline hover:text-slate-200"
                          >
                            Reset to default
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* inline drawer */}
              <ChallengeDetailDrawer
                challenge={ch}
                viewMode={effectiveViewMode}
                isSolved={solved}
                isOpen={isActive && !isLockedForStudent}
                onMarkSolved={() => handleMarkSolved(ch.id)}
                onClearSolved={() => handleClearSolved(ch.id)}
                onClose={() => setActiveChallengeId(null)}
              />
            </React.Fragment>
          );
        })}
      </section>
    </Card>
  );
}
