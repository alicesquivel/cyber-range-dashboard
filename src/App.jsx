import React, { useState } from "react";
import TopNav from "./components/layout/TopNav.jsx";
import Tabs from "./components/layout/Tabs.jsx";
import OverviewTab from "./components/overview/OverviewTab.jsx";
import NetworkTab from "./components/network/NetworkTab.jsx";
import ScoresTab from "./components/scores/ScoresTab.jsx";
import ChallengesTab from "./components/challenges/ChallengesTab.jsx";
import DocsTab from "./components/docs/DocsTab.jsx";

// import ChallengesTab from "./components/challenges/ChallengesTab.jsx";

function App() {
  const [viewMode, setViewMode] = useState("student");
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-background text-slate-100">
      <TopNav viewMode={viewMode} onChangeViewMode={setViewMode} />

      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-50">
              Cyber Range Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {TAB_SUBTITLES[activeTab] ?? TAB_SUBTITLES["Overview"]}
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            Current view:{" "}
            <span className="font-semibold text-slate-200">
              {viewMode === "student" ? "Student" : "Instructor"}
            </span>
          </p>
        </div>

        <div className="mt-6">
          <Tabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

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
const TAB_SUBTITLES = {
  Overview:
    "Overview of Raspberry Pi nodes, scores, lab activity, and challenges.",
  "Network & Nodes": "Network topology, VLANs, and Raspberry Pi node roles.",
  "Scores & Events": "Score breakdown, uptime, penalties, and recent events.",
  "Challenges / CTF":
    "Challenge tasks, flags, and CTF-style missions for this range.",
  Docs: "Documentation, lab handouts, and instructor notes for the Cyber Range.",
};

export default App;
