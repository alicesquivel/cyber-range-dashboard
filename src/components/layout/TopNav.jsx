import React from "react";

export default function TopNav() {
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
      </div>
    </header>
  );
}
