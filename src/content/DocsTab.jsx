// src/components/docs/DocsTab.jsx
import React from "react";
import Card from "../components/ui/Card.jsx";
import {
  START_HERE,
  STUDENT_DOCS,
  INSTRUCTOR_DOCS,
} from "../../content/docsContent.js";

export default function DocsTab({ viewMode }) {
  const isInstructor = viewMode === "instructor";

  const studentDocs = STUDENT_DOCS;
  const instructorDocs = INSTRUCTOR_DOCS;

  return (
    <Card className="space-y-4">
      {/* Intro banner */}
      <Card className="bg-slate-950/70 px-4 py-3 text-xs text-slate-300 shadow-none">
        {isInstructor ? (
          <p>
            Documentation hub for the Cyber Range. Use this page to share
            student-facing handouts and keep instructor-only reference material
            in one place. Links point to files under the public/docs/ folder.
          </p>
        ) : (
          <p>
            Start here to understand what this Cyber Range is, how to read the
            dashboard, and where to find the handouts you need for each lab.
          </p>
        )}
      </Card>

      {/* Start here section */}
      <Card as="section">
        <h2 className="text-sm font-semibold text-slate-100">Start here</h2>
        <p className="mt-1 text-xs text-slate-400">
          A quick overview of the range and how the dashboard fits into your
          labs.
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {START_HERE.map((item) => (
            <DocCard key={item.id} title={item.title} body={item.body} />
          ))}
        </div>
      </Card>

      {/* Student / Instructor sections */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* Student section – always visible */}
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">
              Student resources
            </h3>
            <p className="text-[11px] text-slate-400">Visible to everyone</p>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Use these documents during lab to understand the objectives, login
            steps, and expected deliverables.
          </p>

          <div className="mt-3 space-y-3">
            {studentDocs.map((doc) => (
              <DocCard
                key={doc.id}
                title={doc.title}
                body={doc.body}
                links={doc.links}
              />
            ))}
          </div>
        </Card>

        {/* Instructor section – only in instructor view */}
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">
              Instructor resources
            </h3>
            <p className="text-[11px] text-slate-400">
              {isInstructor
                ? "Visible in instructor view"
                : "Sign in as instructor to view"}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Internal notes for course staff: network layout, range reset
            procedures, and operational playbooks.
          </p>

          {isInstructor ? (
            <div className="mt-3 space-y-3">
              {instructorDocs.map((doc) => (
                <DocCard
                  key={doc.id}
                  title={doc.title}
                  body={doc.body}
                  links={doc.links}
                />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[11px] text-slate-500">
              This section is reserved for instructors. In class, your
              instructor may share selected diagrams or notes from this column.
            </p>
          )}
        </Card>
      </section>
    </Card>
  );
}

function DocCard({ title, body, links = [] }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
      <h4 className="text-xs font-semibold text-slate-100">{title}</h4>
      <p className="mt-1 text-[11px] text-slate-300">{body}</p>

      {links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border border-slate-600 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-100 hover:border-slate-400"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
