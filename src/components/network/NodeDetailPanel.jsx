import React, { useEffect, useRef } from "react";
import { getNodeDetails } from "../../content/networkNodes.js";
import StatusBadge from "../ui/StatusBadge.jsx";
import Card from "../ui/Card.jsx";

// Dummy metrics fallback for now.
// TODO(Jake): once real metrics are wired in, you can remove or simplify this.
function getDummyMetrics(meta, status) {
  if (!meta) return null;

  const baseById = {
    router: { cpu: 0.32, memFreeMb: 420, pingMs: 1.8, load1m: 0.41 },
    dmz: { cpu: 0.27, memFreeMb: 512, pingMs: 2.4, load1m: 0.35 },
    server: { cpu: 0.44, memFreeMb: 380, pingMs: 2.1, load1m: 0.62 },
    client: { cpu: 0.21, memFreeMb: 610, pingMs: 3.0, load1m: 0.28 },
  };

  const base = (meta.id && baseById[meta.id]) ||
    baseById.router || {
      cpu: 0.3,
      memFreeMb: 512,
      pingMs: 2.5,
      load1m: 0.4,
    };

  let cpu = base.cpu;
  let memFreeMb = base.memFreeMb;
  let pingMs = base.pingMs;
  let load1m = base.load1m;

  if (status === "degraded") {
    cpu += 0.12;
    pingMs += 2.0;
    load1m += 0.25;
    memFreeMb -= 80;
  } else if (status === "down") {
    cpu = 0;
    memFreeMb = 0;
    pingMs = NaN;
    load1m = 0;
  }

  return { cpu, memFreeMb, pingMs, load1m };
}

/**
 * Side detail panel for a single node.
 *
 * Props:
 * - node: { name, ip, vlan } from API
 * - status: string ("up", "degraded", "down", "unknown")
 * - metrics: { cpu, memFreeMb, pingMs, load1m } | null (optional)
 * - viewMode: "student" or "instructor"
 * - onClose: function to clear selection
 */
export default function NodeDetailPanel({
  node,
  status,
  metrics,
  viewMode,
  onClose,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (node) {
      // move focus into the panel for keyboard / screen reader users
      panelRef.current?.focus();
    }
  }, [node]);
  if (!node) {
    return (
      <Card as="section" tabIndex={-1} ref={panelRef}>
        <h2 className="text-sm font-semibold text-slate-100">Node details</h2>
        <p className="mt-1 text-xs text-slate-400">
          Select a node in the table or network map to see more information
          about its role in the range.
        </p>
      </Card>
    );
  }

  const meta = getNodeDetails(node.ip);
  const isInstructor = viewMode === "instructor";
  const effectiveMetrics = metrics || getDummyMetrics(meta, status);

  return (
    <Card as="section" tabIndex={-1} ref={panelRef}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            {meta?.displayName || node.name}
          </h2>
          {meta?.hostname && (
            <p className="text-xs text-slate-400">{meta.hostname}</p>
          )}
          <p className="mt-2 text-xs text-slate-300">
            {node.ip} • VLAN {node.vlan}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={status} />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-600 px-2 py-0.5 text-[11px] text-slate-300 hover:bg-slate-800"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {meta?.role && (
        <div className="mt-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Role
          </h3>
          <p className="mt-1 text-xs text-slate-200">{meta.role}</p>
        </div>
      )}

      {meta?.services && (
        <div className="mt-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Key services
          </h3>
          <p className="mt-1 text-xs text-slate-200">{meta.services}</p>
        </div>
      )}

      {meta?.description && (
        <div className="mt-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Description
          </h3>
          <p className="mt-1 text-xs text-slate-200">{meta.description}</p>
        </div>
      )}

      {/* Metrics section (real or dummy) */}
      {effectiveMetrics && (
        <div className="mt-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Metrics {metrics ? "(from telemetry)" : "(dummy)"}
          </h3>
          <dl className="mt-1 grid grid-cols-2 gap-y-1 text-xs text-slate-200">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-400">CPU usage</dt>
              <dd>{Math.round(effectiveMetrics.cpu * 100)}%</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-400">Free memory</dt>
              <dd>{effectiveMetrics.memFreeMb} MB</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-400">Ping</dt>
              <dd>
                {Number.isNaN(effectiveMetrics.pingMs)
                  ? "n/a"
                  : `${effectiveMetrics.pingMs.toFixed(1)} ms`}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-slate-400">Load (1m)</dt>
              <dd>{effectiveMetrics.load1m.toFixed(2)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-[11px] text-slate-500">
            {metrics
              ? "Values loaded from metrics.json via the telemetry API."
              : "Dummy values for now. Later this will be driven by real telemetry from the router or monitoring scripts."}
          </p>
        </div>
      )}

      {meta?.labTips && (
        <div className="mt-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Lab tips
          </h3>
          <p className="mt-1 text-xs text-slate-200">{meta.labTips}</p>
        </div>
      )}

      {isInstructor && (
        <Panel>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Instructor notes
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            TODO(Max + Alicia): add instructor specific guidance here, such as
            quick checks, common misconfigurations, and how this node maps to
            the written lab steps.
          </p>
        </Panel>
      )}
    </Card>
  );
}
