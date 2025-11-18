// src/App.jsx
import React, { useState } from "react";

import TopNav from "./components/layout/TopNav.jsx";
import OverviewTab from "./components/overview/OverviewTab.jsx";
import NetworkTab from "./components/network/NetworkTab.jsx";
import ScoresTab from "./components/scores/ScoresTab.jsx";
import ChallengesTab from "./components/challenges/ChallengesTab.jsx";
import DocsTab from "./components/docs/DocsTab.jsx";

const TABS = [
  "Overview",
  "Network & Nodes",
  "Scores & Events",
  "Challenges / CTF",
  "Docs",
];

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [viewMode, setViewMode] = useState("student"); // "student" | "instructor"

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top bar with logo + Student/Instructor toggle */}
      <TopNav viewMode={viewMode} onChangeViewMode={setViewMode} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        {/* Tabs row */}
        <div className="border-b border-slate-800 pb-2">
          <nav className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={[
                    "rounded-full px-4 py-1.5 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-100 text-slate-950"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-slate-50",
                  ].join(" ")}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active tab content */}
        <div className="mt-6">
          {activeTab === "Overview" && <OverviewTab viewMode={viewMode} />}
          {activeTab === "Network & Nodes" && (
            <NetworkTab viewMode={viewMode} />
          )}
          {activeTab === "Scores & Events" && <ScoresTab viewMode={viewMode} />}
          {activeTab === "Challenges / CTF" && (
            <ChallengesTab viewMode={viewMode} />
          )}
          {activeTab === "Docs" && <DocsTab viewMode={viewMode} />}
        </div>
      </main>
    </div>
  );
}

export default App;
