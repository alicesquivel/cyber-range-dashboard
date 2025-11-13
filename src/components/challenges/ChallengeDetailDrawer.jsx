import React, { useState } from "react";
import { PACKS } from "./challengesContent.js";
import { submitFlag } from "../../api/flags.js";

function packLabel(packId) {
  const pack = PACKS.find((p) => p.id === packId);
  return pack ? pack.name : "Unassigned pack";
}

function packDescription(packId) {
  const pack = PACKS.find((p) => p.id === packId);
  return pack ? pack.description : "";
}

function artifactBadge(art) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide";
  if (art.type === "pcap") return base + " bg-sky-500/10 text-sky-300";
  if (art.type === "logs") return base + " bg-amber-500/10 text-amber-300";
  if (art.type === "pdf") return base + " bg-rose-500/10 text-rose-300";
  if (art.type === "script")
    return base + " bg-emerald-500/10 text-emerald-300";
  return base + " bg-slate-700 text-slate-300";
}

/**
 * Detail drawer for a single challenge.
 *
 * Props:
 * - challenge: challenge object from CHALLENGES, or null
 * - viewMode: "student" | "instructor"
 * - isSolved: boolean (solved locally in this browser)
 * - onMarkSolved: () => void
 * - onClearSolved: () => void
 * - onClose: () => void
 */
export default function ChallengeDetailDrawer({
  challenge,
  viewMode,
  isSolved,
  onMarkSolved,
  onClearSolved,
  onClose,
}) {
  const [flagInput, setFlagInput] = useState("");
  const [flagStatus, setFlagStatus] = useState(null); // {status, message}
  const [submitting, setSubmitting] = useState(false);

  const isInstructor = viewMode === "instructor";

  if (!challenge) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">
          Challenge details
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Click &ldquo;View details&rdquo; on any challenge to see a fuller
          description, suggested steps, and instructor notes.
        </p>
      </section>
    );
  }

  async function handleFlagSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await submitFlag(challenge.id, flagInput);
      setFlagStatus(result);

      if (result.status === "correct" && !isSolved && onMarkSolved) {
        onMarkSolved();
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Filter artifacts based on audience (student vs instructor).
  const baseArtifacts = challenge.artifacts || [];
  const visibleArtifacts = baseArtifacts.filter((art) => {
    if (art.audience === "instructor" && !isInstructor) return false;
    return true; // "student", "both", or undefined
  });

  const basePath = `/challenges/${challenge.id}/`;

  return (
    <section
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm
                 transition-all duration-200 ease-out translate-y-0 opacity-100"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-slate-100">
            {challenge.title}
          </h2>
          <p className="text-[11px] text-slate-400">
            ID: <span className="font-mono">{challenge.id}</span> •{" "}
            {challenge.category} • {challenge.difficulty} • {challenge.points}{" "}
            pts
          </p>
          <p className="text-[11px] text-slate-400">
            Pack:{" "}
            <span className="font-semibold text-slate-200">
              {packLabel(challenge.packId)}
            </span>
          </p>
          {isSolved && (
            <p className="text-[11px] font-semibold text-emerald-400">
              Solved in this browser - local progress only (not the official
              scoreboard).
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-600 px-2 py-0.5 text-[11px] text-slate-200 hover:bg-slate-800"
        >
          Close
        </button>
      </div>

      {/* Description */}
      <div className="mt-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Description
        </h3>
        <p className="mt-1 text-xs text-slate-200">{challenge.summary}</p>
      </div>

      {/* Pack description */}
      <div className="mt-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Mission pack
        </h3>
        <p className="mt-1 text-xs text-slate-200">
          {packDescription(challenge.packId) || "Pack description TBD."}
        </p>
      </div>

      {/* Student hint */}
      <div className="mt-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Hint for students
        </h3>
        <p className="mt-1 text-xs text-slate-200">{challenge.studentHint}</p>
      </div>

      {/* Suggested lab steps */}
      <div className="mt-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Suggested lab steps
        </h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-200">
          <li>
            TODO(Max): replace these bullets with the actual step-by-step
            instructions from the lab handout.
          </li>
          <li>
            Example - connect to the correct Pi, run the required tools, capture
            evidence (screenshots, logs).
          </li>
          <li>
            Example - document what you found and submit according to the lab
            rubric.
          </li>
        </ul>
      </div>

      {/* Artifacts & downloads */}
      <div className="mt-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Artifacts & downloads
        </h3>

        {visibleArtifacts.length === 0 ? (
          <p className="mt-1 text-xs text-slate-200">
            No downloadable artifacts are configured yet for this challenge.
            TODO(Jake/Max): add files under{" "}
            <span className="font-mono">public/challenges/{challenge.id}/</span>{" "}
            and update <span className="font-mono">challengesContent.js</span>.
          </p>
        ) : (
          <ul className="mt-2 space-y-2 text-xs text-slate-200">
            {visibleArtifacts.map((art, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2"
              >
                <div className="space-y-1">
                  <p className="text-xs text-slate-100">{art.label}</p>
                  <p className="text-[10px] text-slate-500">
                    {isInstructor && art.audience === "instructor"
                      ? "Instructor-only artifact"
                      : "Download and use this as part of your investigation."}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span>{artifactBadge(art)}</span>
                  <a
                    href={basePath + art.filename}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-300 underline underline-offset-2 hover:text-sky-200"
                  >
                    Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-2 text-[10px] text-slate-500">
          Files are served from{" "}
          <span className="font-mono">public/challenges/{challenge.id}/</span>.
          In production, you can move these to an object store or LMS if needed.
        </p>
      </div>

      {/* Flag submission (demo only) */}
      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/70 p-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Flag submission - demo only
        </h3>
        <p className="mt-1 text-[11px] text-slate-400">
          This demo uses a local mock API. In the real range, flags will be sent
          to the scoreboard backend. Do not put real assessment flags here.
        </p>

        <form onSubmit={handleFlagSubmit} className="mt-2 space-y-2 text-xs">
          <input
            type="text"
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            placeholder="FLAG{example-demo-flag}"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-900 hover:bg-slate-200 disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Checking..." : "Submit flag (demo)"}
          </button>
        </form>

        {flagStatus && (
          <p
            className={
              "mt-2 text-[11px] " +
              (flagStatus.status === "correct"
                ? "text-emerald-400"
                : flagStatus.status === "incorrect"
                ? "text-rose-400"
                : "text-slate-300")
            }
          >
            {flagStatus.message}
          </p>
        )}
      </div>

      {/* Instructor controls */}
      {isInstructor && (
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/80 p-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Instructor controls (local only)
          </h3>
          <p className="mt-1 text-[11px] text-slate-300">
            These buttons mark progress only in this browser. They are useful
            for demos or testing. In production, map challenge IDs to your
            scoreboard backend instead.
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            <button
              type="button"
              onClick={onMarkSolved}
              className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300 hover:bg-emerald-500/20"
            >
              Mark as solved (local)
            </button>
            <button
              type="button"
              onClick={onClearSolved}
              className="rounded-full bg-slate-700 px-3 py-1 text-slate-200 hover:bg-slate-600"
            >
              Clear solved status
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-500">
            TODO(Alicia/Josh): Replace this with real instructor tools once the
            FastAPI scoreboard and student identity are wired in.
          </p>
        </div>
      )}
    </section>
  );
}
