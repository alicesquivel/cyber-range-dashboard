// src/components/layout/TopNav.jsx
import React from "react";

const VIEW_OPTIONS = [
  { id: "student", label: "Student" },
  { id: "instructor", label: "Instructor" },
];

export default function TopNav({ viewMode, onChangeViewMode }) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Left: logo + product name */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-500/10 text-sm font-semibold text-sky-300">
            CR
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-50">
              Cyber Range in a Box
            </div>
            <div className="text-xs text-slate-400">
              Raspberry Pi cyber range dashboard
            </div>
          </div>
        </div>

        {/* Right: view mode toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            View as
          </span>
          <div
            className="inline-flex rounded-full border border-slate-700 bg-slate-900/80 p-0.5 text-xs"
            role="radiogroup"
            aria-label="Select dashboard view"
          >
            {VIEW_OPTIONS.map((opt) => {
              const isActive = viewMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onChangeViewMode(opt.id)}
                  className={
                    "rounded-full px-3.5 py-1 font-medium transition " +
                    (isActive
                      ? "bg-slate-50 text-slate-900 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-50")
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
