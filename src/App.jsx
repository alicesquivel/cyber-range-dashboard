// src/App.jsx
import React, { useState } from "react";
import TopNav from "./components/layout/TopNav.jsx";
import Tabs from "./components/layout/Tabs.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";

import OverviewTab from "./components/overview/OverviewTab.jsx";
import NetworkTab from "./components/network/NetworkTab.jsx";
import ScoresTab from "./components/scores/ScoresTab.jsx";
import ChallengesTab from "./components/challenges/ChallengesTab.jsx";
import DocsTab from "./components/docs/DocsTab.jsx";

function App() {
  // "student" | "instructor"
  const [viewMode, setViewMode] = useState("student");
  // Tab ids must match the ones used in Tabs + Sidebar
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-background text-slate-100">
      {/* Top navigation bar with logo + view toggle */}
      <TopNav viewMode={viewMode} onChangeViewMode={setViewMode} />

      {/* Main layout */}
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 md:px-6">
        {/* Desktop sidebar */}
        <Sidebar
          activeTab={activeTab}
          onChange={setActiveTab}
          viewMode={viewMode}
        />

        {/* Main content column */}
        <main className="flex-1">
          {/* Mobile tabs (hidden on desktop) */}
          <Tabs activeTab={activeTab} onChange={setActiveTab} />

          {/* Optional small heading instead of big hero */}
          <header className="mt-4 mb-4">
            <h1 className="text-lg font-semibold text-slate-50">
              Cyber Range Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Monitor nodes, scores, challenges, and documentation in one place.
            </p>
          </header>

          {/* Tab content */}
          <div className="mt-4 space-y-4">
            {activeTab === "Overview" && <OverviewTab viewMode={viewMode} />}
            {activeTab === "Network & Nodes" && (
              <NetworkTab viewMode={viewMode} />
            )}
            {activeTab === "Scores & Events" && (
              <ScoresTab viewMode={viewMode} />
            )}
            {activeTab === "Challenges / CTF" && (
              <ChallengesTab viewMode={viewMode} />
            )}
            {activeTab === "Docs" && <DocsTab viewMode={viewMode} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
