// src/components/challenges/ChallengeDetailDrawer.jsx
import React, { useState, useEffect, useRef } from "react";
import { PACKS } from "./challengesContent.js";
import Card from "../ui/Card.jsx";

export default function ChallengeDetailDrawer({
  challenge,
  viewMode,
  isSolved,
  isOpen,
  onMarkSolved,
  onClearSolved,
  onClose,
}) {
  const [flagGuess, setFlagGuess] = useState("");
  const [flagStatus, setFlagStatus] = useState(null);
  const containerRef = useRef(null);

  // Auto-scroll when the drawer opens
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isOpen]);

  // Reset flag status when challenge changes
  useEffect(() => {
    setFlagGuess("");
    setFlagStatus(null);
  }, [challenge?.id]);

  if (!challenge) return null;

  const pack = PACKS.find((p) => p.id === challenge.packId);
  const isInstructor = viewMode === "instructor";

  // Filter artifacts based on audience and current viewMode
  const visibleArtifacts = (challenge.artifacts || []).filter((a) => {
    if (a.audience === "instructor" && viewMode !== "instructor") return false;
    // student-only is fine in both student and instructor view
    return true;
  });

  function handleSubmitFlag(e) {
    e.preventDefault();

    if (!flagGuess.trim()) {
      setFlagStatus({
        ok: false,
        message: "Please enter a flag guess first.",
      });
      return;
    }

    // Demo: accept anything that matches FLAG{something}
    // INTEGRATION NOTE:
    // Replace this demo client-side check by calling the real scoreboard API.
    // Students should update `src/api/flags.js` to POST to `/api/flags` and
    // return a JSON response { status, message }. Example:
    // const resp = await submitFlag(challenge.id, flagGuess);
    // setFlagStatus({ ok: resp.status === 'correct', message: resp.message });
    // if (resp.status === 'correct' && onMarkSolved) onMarkSolved();
    if (/^FLAG\{.+\}$/i.test(flagGuess.trim())) {
      setFlagStatus({
        ok: true,
        message:
          "Demo check passed. In a real range this would contact the scoreboard.",
      });
      if (onMarkSolved) onMarkSolved();
    } else {
      setFlagStatus({
        ok: false,
        message: "Flags should use the format FLAG{example-demo-flag}.",
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className={
        "transition-all duration-300 ease-out overflow-hidden " +
        (isOpen
          ? "mt-3 max-h-[1200px] opacity-100 translate-y-0"
          : "mt-0 max-h-0 opacity-0 -translate-y-2 pointer-events-none")
      }
    >
      <Card as="div" className="bg-slate-950/80 p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              {challenge.title}
            </h3>
            <p className="mt-1 text-[11px] text-slate-400">
              ID:{" "}
              <span className="font-mono lowercase text-slate-300">
                {challenge.id}
              </span>{" "}
              • {challenge.category} • {challenge.points} pts
            </p>
            {pack && (
              <p className="text-[11px] text-slate-400">
                Pack:{" "}
                <span className="font-semibold text-slate-200">
                  {pack.name}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {isSolved && (
              <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Marked solved (local)
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-200 hover:border-slate-500"
            >
              Close
            </button>
          </div>
        </div>

        {/* Description / mission / hints */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3 text-xs text-slate-300">
            <SectionHeading>DESCRIPTION</SectionHeading>
            <p>{challenge.summary}</p>

            <SectionHeading>MISSION PACK</SectionHeading>
            <p>
              Investigate and complete this challenge as part of{" "}
              <span className="font-semibold">
                {pack ? pack.name : "this mission pack"}
              </span>
              .
            </p>

            {challenge.studentHint && (
              <>
                <SectionHeading>HINT FOR STUDENTS</SectionHeading>
                <p>{challenge.studentHint}</p>
              </>
            )}
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <SectionHeading>SUGGESTED LAB STEPS</SectionHeading>
            <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-300">
              <li>
                TODO(Max): replace these bullets with the actual step-by-step
                instructions from the lab handout.
              </li>
              <li>
                Example – connect to the correct Pi, run the required tools,
                capture evidence (screenshots, logs, PCAPs).
              </li>
              <li>
                Example – document what you found and submit according to the
                lab rubric.
              </li>
            </ul>

            {isInstructor && challenge.instructorNotes && (
              <>
                <SectionHeading>INSTRUCTOR NOTES</SectionHeading>
                <p className="text-[11px] text-amber-200/90">
                  {challenge.instructorNotes}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Artifacts & downloads */}
        {visibleArtifacts.length > 0 && (
          <section className="mt-4">
            <SectionHeading>ARTIFACTS & DOWNLOADS</SectionHeading>
            <p className="mb-2 text-[11px] text-slate-400">
              Files are served from{" "}
              <code className="font-mono">
                public/challenges/{challenge.id}/
              </code>
              . In production, you can move these to an object store or LMS if
              needed.
            </p>

            <div className="space-y-2">
              {visibleArtifacts.map((a) => (
                <ArtifactRow
                  key={a.filename}
                  challengeId={challenge.id}
                  artifact={a}
                />
              ))}
            </div>
          </section>
        )}

        {/* Flag submission demo */}
        <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-200">
              Flag submission – demo only
            </h4>
            <p className="text-[10px] text-slate-400">
              This uses a local mock check. In the real range, flags will be
              validated by the scoreboard backend.
            </p>
          </div>

          <form onSubmit={handleSubmitFlag} className="mt-3 space-y-2">
            <label className="text-[11px] font-mono text-slate-300">
              Enter flag guess:
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={flagGuess}
                onChange={(e) => setFlagGuess(e.target.value)}
                placeholder="FLAG{example-demo-flag}"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[12px] font-mono text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-900 hover:bg-slate-200"
              >
                Submit flag (demo)
              </button>
            </div>

            <div className="rounded-md bg-slate-900/80 px-2 py-1 text-[11px] font-mono text-slate-300">
              Example format:{" "}
              <span className="text-sky-300">
                FLAG&#123;example-demo-flag&#125;
              </span>
            </div>

            {flagStatus && (
              <p
                className={
                  "text-[11px] " +
                  (flagStatus.ok ? "text-emerald-300" : "text-rose-300")
                }
              >
                {flagStatus.message}
              </p>
            )}
          </form>
        </section>

        {/* Local solved controls at bottom (optional) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>
            Local solved tracking does not affect the official scoreboard.
          </span>
          <div className="flex gap-2">
            {!isSolved && (
              <button
                type="button"
                onClick={onMarkSolved}
                className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200 hover:border-emerald-400"
              >
                Mark solved (local)
              </button>
            )}
            {isSolved && (
              <button
                type="button"
                onClick={onClearSolved}
                className="rounded-full border border-slate-600 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-200 hover:border-slate-400"
              >
                Clear solved
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </h4>
  );
}

function ArtifactRow({ challengeId, artifact }) {
  const href = `/challenges/${challengeId}/${artifact.filename}`;

  let typeLabel = artifact.type || "file";
  if (typeLabel === "pcap") typeLabel = "PCAP";
  if (typeLabel === "logs") typeLabel = "Logs";
  if (typeLabel === "pdf") typeLabel = "PDF";

  const typeIcon =
    artifact.type === "pcap"
      ? ""
      : artifact.type === "logs"
      ? ""
      : artifact.type === "pdf"
      ? ""
      : "";

  return (
    <div className="flex flex-col items-start justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-300 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <span>{typeIcon}</span>
          <span className="font-semibold text-slate-100">{artifact.label}</span>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
            {typeLabel}
          </span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400">
          Download and use this as part of your investigation.
        </p>
      </div>
      <a
        href={href}
        className="rounded-full border border-slate-600 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-100 hover:border-slate-400"
      >
        Download
      </a>
    </div>
  );
}
