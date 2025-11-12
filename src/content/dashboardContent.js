// Team labels and how we convert points to a readiness percentage.
// Max can adjust this later if needed.

export const TEAM_CONFIG = {
    red: { label: "Red Team", colorClass: "text-rose-400" },
    blue: { label: "Blue Team", colorClass: "text-sky-400" },
    yellow: { label: "Yellow Team", colorClass: "text-amber-300" },
    white: { label: "White Team", colorClass: "text-slate-100" },
};

export function pointsToReadiness(points, maxPoints = 30) {
    return Math.max(0, Math.min(100, Math.round((points / maxPoints) * 100)));
}
