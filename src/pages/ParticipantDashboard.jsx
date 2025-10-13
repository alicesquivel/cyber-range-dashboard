import KPI from '../components/KPI.jsx'
import ServiceHealthTable from '../components/ServiceHealthTable.jsx'
import TopologyMap from '../components/TopologyMap.jsx'
import EventFeed from '../components/EventFeed.jsx'
import { mockServices, mockEvents } from '../data/mock.js'

export default function ParticipantDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Your Score" value="1280" hint="Live total updates each 5s" />
        <KPI label="Uptime (%)" value="96.4" hint="Weighted across services" />
        <KPI label="Attack Penalties" value="–140" hint="Recent last 10 min" />
        <KPI label="Report Bonus" value="+60" hint="Incident quality rubric" />
      </div>
      <ServiceHealthTable services={mockServices} />
      <TopologyMap />
      <EventFeed events={mockEvents} />
    </div>
  )
}
