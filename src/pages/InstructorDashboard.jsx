import ScoreCard from '../components/ScoreCard.jsx'
import ServiceHealthTable from '../components/ServiceHealthTable.jsx'
import EventFeed from '../components/EventFeed.jsx'
import { mockServices, mockEvents } from '../data/mock.js'

export default function InstructorDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoreCard team="Blue" score={1280} uptime={96.4} penalties={140} reports={60} />
        <ScoreCard team="Red" score={920} uptime={0} penalties={0} reports={0} />
        <ScoreCard team="Yellow" score={300} uptime={0} penalties={0} reports={0} />
      </div>
      <ServiceHealthTable services={mockServices} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="text-lg font-semibold mb-3">Automation</div>
          <ul className="text-sm space-y-2">
            <li className="flex items-center justify-between">
              <span>Start Atomic Red Team campaign</span>
              <button className="px-3 py-2 rounded-lg bg-slate-900 text-white">Run</button>
            </li>
            <li className="flex items-center justify-between">
              <span>Generate Yellow benign traffic</span>
              <button className="px-3 py-2 rounded-lg bg-slate-900 text-white">Start</button>
            </li>
            <li className="flex items-center justify-between">
              <span>Re-image & redeploy lab</span>
              <button className="px-3 py-2 rounded-lg border border-slate-300">Execute</button>
            </li>
          </ul>
        </div>
        <EventFeed events={mockEvents} />
      </div>
    </div>
  )
}
