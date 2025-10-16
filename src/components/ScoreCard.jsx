export default function ScoreCard({ team, score, uptime, penalties, reports }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{team} Team</h3>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
        <div>
          <div className="text-slate-500">Uptime</div>
          <div className="font-medium">{uptime}%</div>
        </div>
        <div>
          <div className="text-slate-500">Penalties</div>
          <div className="font-medium">-{penalties}</div>
        </div>
        <div>
          <div className="text-slate-500">Report Bonus</div>
          <div className="font-medium">+{reports}</div>
        </div>
      </div>
    </div>
  )
}
