import React from "react";

const statusMap = {
  up: { label: "Online", className: "bg-emerald-500/10 text-emerald-400" },
  degraded: { label: "Degraded", className: "bg-amber-500/10 text-amber-400" },
  down: { label: "Down", className: "bg-rose-500/10 text-rose-400" },
  available: {
    label: "Available",
    className: "bg-emerald-500/10 text-emerald-300",
  },
  locked: { label: "Locked", className: "bg-amber-500/10 text-amber-300" },
  hidden: {
    label: "Hidden from students",
    className: "bg-rose-500/10 text-rose-300",
  },
};

export default function StatusBadge({ status, children, className = "" }) {
  const info = statusMap[status] || {
    label: children || "Unknown",
    className: "bg-slate-700 text-slate-300",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${info.className} ${className}`}
    >
      {children || info.label}
    </span>
  );
}
