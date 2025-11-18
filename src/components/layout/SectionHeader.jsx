// src/components/layout/SectionHeader.jsx
import React from "react";

/**
 * Generic section header used across tabs.
 *
 * Props:
 * - title: main title (string)
 * - subtitle: smaller description text (string, optional)
 * - children: optional right-hand content (text, badges, etc.)
 * - className: extra Tailwind classes for outer wrapper (optional)
 */
function SectionHeader({ title, subtitle, children, className = "" }) {
  return (
    <div className={`mb-3 flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
          {title}
        </h2>

        {children ? (
          <div className="text-[11px] text-slate-400">{children}</div>
        ) : null}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 max-w-3xl">{subtitle}</p>
      )}
    </div>
  );
}

export default SectionHeader;
