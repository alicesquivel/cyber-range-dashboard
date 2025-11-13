import React from "react";

const TABS = [
  "Overview",
  "Network & Nodes",
  "Scores & Events",
  "Challenges / CTF",
  "Docs",
];

export default function Tabs({ activeTab, onChange }) {
  return (
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-1 text-xs">
      {TABS.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={
              "rounded-xl px-3 py-2 font-medium transition " +
              (isActive
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-300 hover:bg-slate-800")
            }
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
}
