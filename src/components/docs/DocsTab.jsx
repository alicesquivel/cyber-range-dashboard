// src/components/docs/DocsTab.jsx
import React from "react";
import Card from "../ui/Card.jsx";
import {
  START_HERE,
  STUDENT_DOCS,
  INSTRUCTOR_DOCS,
} from "../../content/docsContent.js";

export default function DocsTab({ viewMode }) {
  const isInstructor = viewMode === "instructor";

  return (
    <Card className="space-y-4">
      {/* START HERE SECTION */}
      <Card as="section">
        <h2 className="text-sm font-semibold text-slate-100">Start here</h2>
        <p className="mt-1 text-xs text-slate-400">
          Overview of the range and how this dashboard fits into your labs.
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {START_HERE.map((item) => (
            <DocCard key={item.id} title={item.title} body={item.body} />
          ))}
        </div>
      </Card>

      {/* STUDENT + INSTRUCTOR PANELS */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* Student docs */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-100">
            Student resources
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Lab handouts, quickstart guides, and reference documents.
          </p>

          <div className="mt-3 space-y-3">
            {STUDENT_DOCS.map((doc) => (
              <DocCard
                key={doc.id}
                title={doc.title}
                body={doc.body}
                links={doc.links}
              />
            ))}
          </div>
        </Card>

        {/* Instructor docs */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-100">
            Instructor resources
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Internal notes for course staff. Students will not normally see
            these documents.
          </p>

          {isInstructor ? (
            <div className="mt-3 space-y-3">
              {INSTRUCTOR_DOCS.map((doc) => (
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
              Switch to Instructor view to see internal range documentation.
            </p>
          )}
        </Card>
      </section>
    </Card>
  );
}

function DocCard({ title, body, links = [] }) {
  return (
    <Card
      as="article"
      className="rounded-xl p-3"
      tabIndex={0}
      role="article"
      aria-label={title}
    >
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
    </Card>
  );
}
