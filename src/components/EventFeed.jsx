export default function EventFeed({ events }) {
  return (
    <div className="card p-5">
      <div className="text-lg font-semibold mb-3">Live Events</div>
      <ul className="space-y-2 text-sm">
        {events.map((e, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 inline-block w-2 h-2 rounded-full bg-slate-400"></span>
            <div>
              <div className="font-medium">{e.title}</div>
              <div className="text-slate-500">{e.detail}</div>
              <div className="text-xs text-slate-400 mt-0.5">{e.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
