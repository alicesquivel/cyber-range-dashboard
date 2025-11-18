import React, { useState } from "react";
import Card from "../ui/Card.jsx";

/*
  Instructor-only tools panel.

  These currently simulate actions only.
  Later, each action can call a real internal API endpoint, for example:

    fetch("http://10.0.0.30:8080/api/scoreboard/reset", { method: "POST" })

  TODO(Josh): Implement real scoreboard resets and test events via FastAPI.
  TODO(Jake): Add endpoints for restarting Router Pi, DMZ services, telemetry reloads.
  TODO(Max): Adjust wording and add lab-specific help text and guardrails.
*/

// Central list of actions per section so students can clearly see
// what exists and what the expected backend endpoint might be.
const ACTIONS_BY_SECTION = {
  Scores: [
    {
      key: "reset-scores",
      label: "Reset all scores",
      suggestedEndpoint: "POST /api/scoreboard/reset",
    },
    {
      key: "test-event",
      label: "Trigger test scoring event",
      suggestedEndpoint: "POST /api/scoreboard/test-event",
    },
    {
      key: "freeze-scoring",
      label: "Freeze scoring temporarily",
      suggestedEndpoint: "POST /api/scoreboard/freeze",
    },
  ],
  Network: [
    {
      key: "restart-router-network",
      label: "Restart Router Pi network stack",
      suggestedEndpoint: "POST /api/network/router/restart",
    },
    {
      key: "restart-dmz-service",
      label: "Restart DMZ web service",
      suggestedEndpoint: "POST /api/network/dmz/restart-web",
    },
    {
      key: "reload-telemetry",
      label: "Reload telemetry snapshot",
      suggestedEndpoint: "POST /api/telemetry/reload",
    },
  ],
};

function getHelpText(section) {
  if (section === "Scores") {
    return (
      <>
        <p className="mt-1 text-[11px] text-slate-300">
          Use these controls during exercises to manage the scoreboard. In the
          final version, they should call the scoreboard API on the Server Pi.
        </p>
        <p className="mt-1 text-[11px] text-slate-400">Example flows:</p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-slate-400">
          <li>Reset scores before starting a new round.</li>
          <li>Trigger a test event to verify that the dashboard updates.</li>
          <li>Freeze scoring while you explain a scenario or debrief.</li>
        </ul>
      </>
    );
  }

  if (section === "Network") {
    return (
      <>
        <p className="mt-1 text-[11px] text-slate-300">
          Use these controls to simulate basic range maintenance tasks, like
          restarting services or reloading telemetry.
        </p>
        <p className="mt-1 text-[11px] text-slate-400">Example flows:</p>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-[11px] text-slate-400">
          <li>Restart the router network stack if all nodes show as down.</li>
          <li>
            Restart the DMZ web service when a lab requires a clean state.
          </li>
          <li>Reload telemetry if health status looks outdated.</li>
        </ul>
      </>
    );
  }

  return (
    <p className="mt-1 text-[11px] text-slate-300">
      These tools are reserved for instructors and map to internal range
      actions. In the final version they will call backend APIs instead of just
      simulating actions.
    </p>
  );
}

export default function InstructorTools({ section }) {
  const [message, setMessage] = useState(null);
  const [log, setLog] = useState([]);
  const [pendingAction, setPendingAction] = useState(null); // { label, key, suggestedEndpoint } or null
  const [showHelp, setShowHelp] = useState(false);

  const actions = ACTIONS_BY_SECTION[section] ?? [];

  function openConfirm(action) {
    setPendingAction(action);
  }

  function closeConfirm() {
    setPendingAction(null);
  }

  function simulateAction(actionLabel) {
    // Here is where real API calls would go later.
    setMessage(`Action executed: ${actionLabel}`);

    const entry = {
      time: new Date().toLocaleTimeString(),
      label: actionLabel,
    };
    setLog((prev) => [entry, ...prev].slice(0, 5)); // keep last 5 entries

    setTimeout(() => setMessage(null), 2500);
  }

  function confirmAndExecute() {
    if (!pendingAction) return;
    simulateAction(pendingAction.label);
    closeConfirm();
  }

  return (
    <Card as="section" className="relative bg-slate-900/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Instructor tools - {section}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Visible only in Instructor view. Right now these controls simulate
            actions and update the log. Later, they can call internal APIs on
            the Server Pi or Router Pi that match the suggested endpoints.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="mt-1 rounded-full border border-slate-600 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
        >
          {showHelp ? "Hide help" : "How to use"}
        </button>
      </div>

      {showHelp && (
        <Card className="mt-3 p-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            How to use these tools
          </h3>
          {getHelpText(section)}
          <p className="mt-2 text-[11px] text-slate-500">
            TODO(Alicia): add links to written range documentation or lab
            handouts here. For example: range overview, scoring rules, or
            troubleshooting checklist.
          </p>
        </Card>
      )}

      {/* Action buttons */}
      <div className="mt-4 grid gap-2 text-xs">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => openConfirm(action)}
            className="rounded-lg bg-slate-800 px-3 py-2 text-left hover:bg-slate-700"
          >
            {action.label}
          </button>
        ))}

        {actions.length === 0 && (
          <p className="text-[11px] text-slate-500">
            No instructor actions defined for this section yet.
          </p>
        )}
      </div>

      {/* Temporary feedback message */}
      {message && (
        <p className="mt-3 rounded-lg bg-slate-800 p-2 text-xs text-slate-300">
          {message}
        </p>
      )}

      {/* Action log */}
      <Card className="mt-4 p-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Recent instructor actions (simulated)
        </h3>
        {log.length === 0 ? (
          <p className="mt-1 text-[11px] text-slate-500">
            No actions executed yet in this view.
          </p>
        ) : (
          <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
            {log.map((entry, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-slate-400">{entry.time}</span>
                <span className="ml-2 text-right">{entry.label}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Confirmation modal */}
      {pendingAction && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80">
          <Card className="w-full max-w-sm p-4 shadow-lg" as="div">
            <h3 className="text-sm font-semibold text-slate-100">
              Confirm instructor action
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              You are about to execute the following action:
            </p>
            <p className="mt-2 rounded-lg bg-slate-800 p-2 text-xs text-slate-100">
              {pendingAction.label}
            </p>

            {pendingAction.suggestedEndpoint && (
              <p className="mt-2 text-[11px] text-slate-400">
                Suggested backend endpoint for students:
                <br />
                <span className="font-mono text-[11px] text-slate-200">
                  {pendingAction.suggestedEndpoint}
                </span>
              </p>
            )}

            <p className="mt-2 text-[11px] text-slate-400">
              In the future, this will send a request to the internal range
              services. For now, it only updates the simulated log.
            </p>

            <div className="mt-4 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={closeConfirm}
                className="rounded-full border border-slate-600 px-3 py-1 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAndExecute}
                className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-900 hover:bg-slate-200"
              >
                Confirm
              </button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
