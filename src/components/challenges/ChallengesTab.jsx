import React, { useMemo, useState } from "react";
import { CHALLENGES, PACKS } from "./challengesContent.js";
import ChallengeDetailDrawer from "./ChallengeDetailDrawer.jsx";

function difficultyBadgeClass(level) {
  if (level === "easy") return "bg-emerald-500/10 text-emerald-300";
  if (level === "medium") return "bg-amber-500/10 text-amber-300";
  if (level === "hard") return "bg-rose-500/10 text-rose-300";
  return "bg-slate-700 text-slate-300";
}

// Local storage helpers for per-browser progress.
const PROGRESS_KEY = "cyberRangeCtfProgress";

function loadProgress() {
  if (typeof window === "undefined") return { solved: {} };
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { solved: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { solved: {} };
    if (!parsed.solved) parsed.solved = {};
    return parsed;
  } catch {
    return { solved: {} };
  }
}

function saveProgress(progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export default function ChallengesTab({ viewMode }) {
  const isInstructor = viewMode === "instructor";

  // Filters + sorting state
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [packFilter, setPackFilter] = useState("all");
  const [sortMode, setSortMode] = useState("points-desc");
  const [searchTerm, setSearchTerm] = useState("");

  // Selected challenge for detail drawer
  const [selectedId, setSelectedId] = useState(null);

  // Local CTF progress
  const [progress, setProgress] = useState(() => loadProgress());

  const solvedIds = progress.solved || {};

  const totalPoints = useMemo(
    () =>
      CHALLENGES.filter((c) => solvedIds[c.id]).reduce(
        (sum, c) => sum + (c.points || 0),
        0
      ),
    [solvedIds]
  );

  const totalAvailablePoints = useMemo(
    () => CHALLENGES.reduce((sum, c) => sum + (c.points || 0), 0),
    []
  );

  // Build category and pack lists for filters
  const categoryOptions = useMemo(() => {
    const set = new Set(CHALLENGES.map((c) => c.category));
    return ["all", ...Array.from(set)];
  }, []);

  const packOptions = useMemo(() => {
    return ["all", ...PACKS.map((p) => p.id)];
  }, []);

  // Filter + sort list
  const visibleChallenges = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let list = CHALLENGES.filter((c) => {
      if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) {
        return false;
      }
      if (categoryFilter !== "all" && c.category !== categoryFilter) {
        return false;
      }
      if (packFilter !== "all" && c.packId !== packFilter) {
        return false;
      }
      if (term) {
        const haystack =
          `${c.title} ${c.summary} ${c.studentHint}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    if (sortMode === "points-asc") {
      list = list.slice().sort((a, b) => a.points - b.points);
    } else if (sortMode === "points-desc") {
      list = list.slice().sort((a, b) => b.points - a.points);
    }

    return list;
  }, [difficultyFilter, categoryFilter, packFilter, sortMode, searchTerm]);

  const selectedChallenge = CHALLENGES.find((c) => c.id === selectedId) ?? null;

  function handleMarkSolved(id) {
    setProgress((prev) => {
      const next = {
        ...prev,
        solved: {
          ...(prev.solved || {}),
          [id]: prev.solved?.[id] || new Date().toISOString(),
        },
      };
      saveProgress(next);
      return next;
    });
  }

  function handleClearSolved(id) {
    setProgress((prev) => {
      const nextSolved = { ...(prev.solved || {}) };
      delete nextSolved[id];
      const next = { ...prev, solved: nextSolved };
      saveProgress(next);
      return next;
    });
  }

  function packName(packId) {
    const pack = PACKS.find((p) => p.id === packId);
    return pack ? pack.name : "Unassigned pack";
  }

  return (
    <div className="space-y-4">
      {/* Banner */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-300">
        {isInstructor ? (
          <p>
            Instructor view - this tab lists range challenges and CTF tasks.
            Filters help you match tasks to lab weeks. Local progress is stored
            only in this browser for demos; production scoring should come from
            the scoreboard backend.
          </p>
        ) : (
          <p>
            Student view - use this tab to track CTF-style challenges. Filters
            help you focus on tasks that match your current lab. Click
            &ldquo;View details&rdquo; for full instructions and a demo flag
            checker.
          </p>
        )}
      </section>

      {/* Local CTF summary */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">
          Your CTF progress (this browser only)
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Solves are stored in localStorage so you can test the flow without a
          backend. Official scores should come from the Raspberry Pi scoreboard.
        </p>
        <div className="mt-2 flex flex-wrap gap-4 text-xs">
          <div>
            <p className="text-[11px] text-slate-400">Solved challenges</p>
            <p className="text-base font-semibold text-slate-100">
              {Object.keys(solvedIds).length} / {CHALLENGES.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">CTF points (local)</p>
            <p className="text-base font-semibold text-slate-100">
              {totalPoints} / {totalAvailablePoints}
            </p>
          </div>
        </div>
      </section>

      {/* Filters + controls */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2 text-xs">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Filters
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Difficulty buttons */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">Difficulty:</span>
                {["all", "easy", "medium", "hard"].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficultyFilter(lvl)}
                    className={
                      "rounded-full px-2 py-1 text-[11px] " +
                      (difficultyFilter === lvl
                        ? "bg-slate-100 text-slate-900"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700")
                    }
                  >
                    {lvl === "all"
                      ? "All"
                      : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </button>
                ))}
              </div>

              {/* Category select */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-200"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pack select */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">
                  Mission pack:
                </span>
                <select
                  value={packFilter}
                  onChange={(e) => setPackFilter(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-200"
                >
                  <option value="all">All</option>
                  {PACKS.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort select */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">Sort:</span>
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-200"
                >
                  <option value="points-desc">Points (high to low)</option>
                  <option value="points-asc">Points (low to high)</option>
                  <option value="default">Original order</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search box */}
          <div className="w-full max-w-xs text-xs">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or hint…"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      {/* Challenges list */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Challenges & CTF tasks
          </h2>
          <p className="text-[11px] text-slate-400">
            {visibleChallenges.length} shown • {CHALLENGES.length} total
          </p>
        </div>

        <div className="mt-3 space-y-3">
          {visibleChallenges.length === 0 && (
            <p className="text-xs text-slate-400">
              No challenges match the current filters. Try widening the
              difficulty or clearing the search.
            </p>
          )}

          {visibleChallenges.map((c) => {
            const solved = !!solvedIds[c.id];
            return (
              <article
                key={c.id}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-100">
                        {c.title}
                      </h3>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                        {c.category}
                      </span>
                      <span
                        className={
                          "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide " +
                          difficultyBadgeClass(c.difficulty)
                        }
                      >
                        {c.difficulty} • {c.points} pts
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                        {c.status === "locked"
                          ? "Locked (future)"
                          : c.status === "solved"
                          ? "Solved"
                          : "Available"}
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                        {packName(c.packId)}
                      </span>
                      {solved && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300">
                          Solved (local)
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-300">{c.summary}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Hint for students: {c.studentHint}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className="mt-2 rounded-full border border-slate-600 px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                    >
                      View details
                    </button>
                  </div>

                  {/* Right side: small solved info */}
                  <div className="mt-2 w-full max-w-xs text-xs md:mt-0">
                    <p className="text-[11px] text-slate-400">
                      Status in this browser:
                    </p>
                    <p className="mt-1 text-xs text-slate-200">
                      {solved
                        ? "Marked as solved (local). Use instructor tools or demo flags to clear or change."
                        : "Not yet solved in this browser."}
                    </p>
                  </div>
                </div>

                {isInstructor && (
                  <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/80 p-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Instructor notes
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {c.instructorNotes}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      TODO(Josh): map this challenge ID (
                      <span className="font-mono">{c.id}</span>) to scoreboard
                      rules on the server side. TODO(Max): update wording based
                      on the actual lab handouts.
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Detail drawer */}
      <ChallengeDetailDrawer
        challenge={selectedChallenge}
        viewMode={viewMode}
        isSolved={selectedChallenge ? !!solvedIds[selectedChallenge.id] : false}
        onMarkSolved={
          selectedChallenge
            ? () => handleMarkSolved(selectedChallenge.id)
            : () => {}
        }
        onClearSolved={
          selectedChallenge
            ? () => handleClearSolved(selectedChallenge.id)
            : () => {}
        }
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
