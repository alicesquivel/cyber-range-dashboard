import React, { useState } from "react";
import TopNav from "./components/layout/TopNav.jsx";
import Tabs from "./components/layout/Tabs.jsx";
import OverviewTab from "./components/overview/OverviewTab.jsx";
import NetworkTab from "./components/network/NetworkTab.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-background text-slate-100">
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-50">
              Cyber Range Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Overview of Raspberry Pi nodes, scores, and lab activity.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Tabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="mt-6">
          {activeTab === "Overview" && <OverviewTab />}

          {activeTab === "Network & Nodes" && <NetworkTab />}

          {activeTab === "Scores & Events" && (
            <p className="text-sm text-slate-400">
              Scores & Events tab – coming after Network & Nodes.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
