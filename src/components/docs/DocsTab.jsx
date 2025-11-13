import React from "react";

export default function DocsTab({ viewMode }) {
  const isInstructor = viewMode === "instructor";

  return (
    <div className="space-y-4">
      {/* Banner */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-300">
        {isInstructor ? (
          <p>
            Instructor view - use this page as a hub for range documentation,
            lab handouts, and architecture references. You can keep PDFs in the
            public/ or docs/ folder of this repo and link to them here.
          </p>
        ) : (
          <p>
            Student view - use this page to find lab handouts, range diagrams,
            and other reference material provided by your instructor.
          </p>
        )}
      </section>

      {/* Core documentation cards */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* Instructor tools PDF */}
        <article className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Instructor tools documentation
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Describes how the instructor tools panel works, including reset
              scores, test events, and network controls, along with the
              suggested backend API endpoints.
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              File:{" "}
              <span className="font-mono">
                public/Instructor_Tools_Documentation.pdf
              </span>
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <a
              href="/Instructor_Tools_Documentation.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-900 hover:bg-slate-200"
            >
              Open PDF
            </a>
            <span className="text-[11px] text-slate-500">
              TODO(Alicia): update if path changes.
            </span>
          </div>
        </article>

        {/* Range overview / network diagram placeholder */}
        <article className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Cyber Range overview
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              High level description of the Cyber Range in a Box, including node
              roles, VLAN layout, and example lab scenarios.
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              TODO(Alicia + Max): link to your range proposal PDF, network
              diagram, or Overleaf export here.
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <button
              type="button"
              className="cursor-not-allowed rounded-full bg-slate-800 px-3 py-1 text-slate-400"
            >
              Coming soon
            </button>
            <span className="text-[11px] text-slate-500">
              Example: docs/Range_Overview.pdf
            </span>
          </div>
        </article>
      </section>

      {/* Student lab docs section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-100">
          Lab and exercise documents
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          This section is meant for student facing material. You can link lab
          PDFs, markdown guides, or external Canvas pages.
        </p>

        <ul className="mt-3 space-y-2 text-xs text-slate-300">
          <li className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
            <div>
              <p className="font-semibold text-slate-100">
                Lab 1 - Intro to the range
              </p>
              <p className="text-[11px] text-slate-400">
                TODO(Max): link to Lab 1 handout or Canvas module.
              </p>
            </div>
            <button
              type="button"
              className="cursor-not-allowed rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-400"
            >
              Coming soon
            </button>
          </li>

          <li className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
            <div>
              <p className="font-semibold text-slate-100">
                Lab 2 - Network capture and forensics
              </p>
              <p className="text-[11px] text-slate-400">
                TODO(Max): link to forensics lab PDF or GitHub instructions.
              </p>
            </div>
            <button
              type="button"
              className="cursor-not-allowed rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-400"
            >
              Coming soon
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
}
