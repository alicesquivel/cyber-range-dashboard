import React from "react";
import { CHALLENGES } from "./challengesContent.js";

function difficultyBadgeClass(level) {
  if (level === "easy") return "bg-emerald-500/10 text-emerald-300";
  if (level === "medium") return "bg-amber-500/10 text-amber-300";
  if (level === "hard") return "bg-rose-500/10 text-rose-300";
  return "bg-slate-700 text-slate-300";
}

export default function ChallengesTab({ viewMode }) {
  const isInstructor = viewMode === "instructor";

  return (
    <div className="space-y-4">
      {/* Banner */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-300">
        {isInstructor ? (
          <p>
            Instructor view - this tab lists range challenges / CTF tasks. You
            can tie these to scoring rules on the server. Real flags should
            never be stored in this frontend; they belong on the DMZ/Server Pi
            and are checked by the scoreboard backend.
          </p>
        ) : (
          <p>
            Student view - use this tab to see the current range challenges and
            how many points they are worth. For now, flag submission is not
            wired up; follow your instructor&apos;s directions for reporting
            solutions.
          </p>
        )}
      </section>

      {/* Challenges list */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Challenges & CTF tasks
          </h2>
          <p className="text-[11px] text-slate-400">
            {CHALLENGES.length} defined • dummy data for now
          </p>
        </div>

        <div className="mt-3 space-y-3">
          {CHALLENGES.map((c) => (
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
                  </div>
                  <p className="mt-2 text-xs text-slate-300">{c.summary}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Hint for students: {c.studentHint}
                  </p>
                </div>

                {/* Right side: flag submission placeholder */}
                <div className="mt-2 w-full max-w-xs text-xs md:mt-0">
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Flag submission
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="FLAG{example-flag} (disabled in demo)"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    disabled
                    className="mt-2 w-full cursor-not-allowed rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-400"
                  >
                    Submit flag (backend TODO)
                  </button>
                  <p className="mt-1 text-[10px] text-slate-500">
                    In the real range, this will send the flag to the scoreboard
                    API. For now, follow your instructor&apos;s instructions
                    (for example, demoing your solution or submitting in
                    Canvas).
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
                    rules on the server side. TODO(Max): update wording based on
                    the actual lab handouts.
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
