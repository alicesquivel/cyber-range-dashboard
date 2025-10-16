export default function ServiceHealthTable({ services }) {
  return (
    <div className="card p-5">
      <div className="text-lg font-semibold mb-3">Service Health (DMZ + Server)</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-4">Service</th>
              <th className="py-2 pr-4">Segment</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">HTTP</th>
              <th className="py-2 pr-4">Latency</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-2 pr-4">{s.name}</td>
                <td className="py-2 pr-4">{s.segment}</td>
                <td className="py-2 pr-4">
                  <span className={"px-2 py-1 rounded-lg text-xs " + (s.status === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                    {s.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-2 pr-4">{s.http}</td>
                <td className="py-2 pr-4">{s.latency} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
