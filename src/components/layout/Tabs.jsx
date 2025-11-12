import React from "react";

const TABS = ["Overview", "Network & Nodes", "Scores & Events"];

export default function Tabs({ activeTab, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            activeTab === tab
              ? "bg-slate-900 text-slate-50"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
