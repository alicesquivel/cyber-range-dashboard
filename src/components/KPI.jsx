export default function KPI({ label, value, hint }) {
  return (
    <div className="card p-4">
      <div className="kpi">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  )
}
