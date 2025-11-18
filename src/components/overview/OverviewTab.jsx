// src/components/Overview/Overview.jsx (or OverviewTab.jsx)
import React from "react";
import SectionHeader from "../layout/SectionHeader";
import Card from "../ui/Card.jsx";

function OverviewTab({ viewMode }) {
  const isInstructor = viewMode === "instructor";

  const nodes = [
    { name: "Router Pi", ip: "10.0.0.1", vlan: "VLAN 1", status: "online" },
    { name: "DMZ Pi", ip: "10.0.0.20", vlan: "VLAN 10", status: "online" },
    { name: "Server Pi", ip: "10.0.0.30", vlan: "VLAN 20", status: "degraded" },
    { name: "Client Pi", ip: "10.0.0.40", vlan: "VLAN 30", status: "online" },
  ];

  const teams = [
    { name: "Red Team", score: 820, readiness: 100 },
    { name: "Blue Team", score: 760, readiness: 100 },
    { name: "Yellow Team", score: 640, readiness: 100 },
    { name: "White Team", score: 900, readiness: 100 },
  ];

  function statusBadgeClasses(status) {
    if (status === "online") {
      return "bg-emerald-500/10 text-emerald-300";
    }
    if (status === "degraded") {
      return "bg-amber-500/10 text-amber-300";
    }
    return "bg-slate-500/10 text-slate-300";
  }

  return (
    <div className="space-y-8">
      {/* Context ribbon */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
        {isInstructor ? (
          <p>
            Instructor view – use this to monitor node health, team readiness,
            and challenge progress while students work in the range.
          </p>
        ) : (
          <p>
            Student view – keep an eye on your team and the status of each range
            node as you move through the labs.
          </p>
        )}
      </div>

      {/* Network map section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <SectionHeader
          title="Network map"
          subtitle="Snapshot of the core Raspberry Pi nodes in this range."
        >
          <span>Subnet 10.0.0.0/24</span>
        </SectionHeader>

        <div className="mt-3 grid gap-4 md:grid-cols-4">
          {nodes.map((node) => (
            <Card
              as="div"
              key={node.name}
              className="flex flex-col justify-between bg-slate-900/80 px-4 py-3 transition hover:border-slate-700 hover:bg-slate-900"
              tabIndex={0}
              role="group"
              aria-label={`${node.name} ${node.ip} ${node.vlan} status ${node.status}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // reserved: could open node details
                }
              }}
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  {node.name}
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  {node.ip} • {node.vlan}
                </p>
              </div>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusBadgeClasses(
                    node.status
                  )}`}
                >
                  {node.status === "online"
                    ? "Online"
                    : node.status === "degraded"
                    ? "Degraded"
                    : "Unknown"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Team readiness section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <SectionHeader
          title="Team readiness"
          subtitle="Scores converted to a simple 0–100 scale so teams can compare progress at a glance."
        >
          <span>Dummy data for development</span>
        </SectionHeader>

        <div className="mt-3 grid gap-4 md:grid-cols-4">
          {teams.map((team) => (
            <div
              key={team.name}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3"
            >
              <h3 className="text-sm font-semibold text-slate-100">
                {team.name}
              </h3>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-sky-400"
                  style={{ width: `${team.readiness}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                {team.score} pts • {team.readiness}% readiness
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Node details section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <SectionHeader
          title="Node details"
          subtitle="In a live deployment, selecting a node in the network map or table would show detailed metrics here."
        >
          <span>Read-only demo state</span>
        </SectionHeader>

        <div className="mt-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-6 text-sm text-slate-400">
          Select a node in the Network & Nodes tab or in the map to view more
          information about its role in the range, recent events, and health
          metrics.
        </div>
      </section>
    </div>
  );
}

export default OverviewTab;
