// src/components/layout/Tabs.jsx
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
    <div className="flex gap-2 overflow-x-auto border-b border-slate-800 pb-2 md:hidden">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={[
              "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? "bg-slate-100 text-slate-900"
                : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/90",
            ].join(" ")}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
