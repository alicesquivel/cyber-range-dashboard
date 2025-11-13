import React from "react";

export default function TopNav({ viewMode, onChangeViewMode }) {
  return (
    <header className="w-full border-b border-slate-800 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl font-bold">
            CR
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Cyber Range in a Box
            </p>
            <p className="text-xs text-slate-400">
              Raspberry Pi cyber range dashboard
            </p>
          </div>
        </div>

        {/* View switcher - Student vs Instructor */}
        <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/60 p-1 text-[11px]">
          {/* TODO(Max): style or relabel this toggle if you want different wording. */}
          <button
            type="button"
            onClick={() => onChangeViewMode("student")}
            className={
              "rounded-full px-2 py-1 font-medium " +
              (viewMode === "student"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-300 hover:bg-slate-800")
            }
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode("instructor")}
            className={
              "rounded-full px-2 py-1 font-medium " +
              (viewMode === "instructor"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-300 hover:bg-slate-800")
            }
          >
            Instructor
          </button>
        </div>
      </div>
    </header>
  );
}
