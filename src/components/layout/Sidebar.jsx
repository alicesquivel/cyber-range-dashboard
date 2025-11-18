import React from "react";
import Card from "../ui/Card.jsx";

const NAV_ITEMS = [
  {
    id: "Overview",
    label: "Overview",
    description: "High-level range status",
  },
  {
    id: "Network & Nodes",
    label: "Network & Nodes",
    description: "Pi roles, IPs, and health",
  },
  {
    id: "Scores & Events",
    label: "Scores & Events",
    description: "Scoring and incident timeline",
  },
  {
    id: "Challenges / CTF",
    label: "Challenges / CTF",
    description: "Missions and flags",
  },
  {
    id: "Docs",
    label: "Docs",
    description: "Lab handouts and notes",
  },
];

export default function Sidebar({ activeTab, onChange, viewMode }) {
  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="sticky top-4 space-y-4">
        <Card className="px-4 py-3 bg-slate-950/70 shadow-none">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Range navigation
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Switch between overview, nodes, scores, challenges, and docs.
          </p>
          <p className="mt-3 text-[11px] text-slate-500">
            Current view:{" "}
            <span className="font-semibold text-slate-100">
              {viewMode === "student" ? "Student" : "Instructor"}
            </span>
          </p>
        </Card>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={[
                  "w-full rounded-xl border px-3 py-2 text-left text-sm transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/70",
                  isActive
                    ? "border-sky-500/70 bg-slate-900 text-slate-50 shadow-sm"
                    : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-600 hover:bg-slate-900/80",
                ].join(" ")}
              >
                <div className="font-semibold">{item.label}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {item.description}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
