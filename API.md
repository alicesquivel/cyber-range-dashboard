API Contract (Simulator / Server)
=================================

GET /api/vlan-profile
  Response: { dmz: number, server: number, client: number, internet: number }

GET /api/nodes
  Response: [{ name, ip, vlan, status, cpu, temp }, ...]

GET /api/scoreboard
  Response: { uptime: number, penalties: number, bonus: number }

GET /api/events
  Response: [{ id, type, title, detail?, value?, time }, ...]

POST /api/events
  Body: { type: string, title: string, detail?: string, value?: number }
  Response: created event object (201)

POST /api/scoreboard/uptime
  Body: { uptime: number }
  Response: scoreboard object

GET /api/stacks
  Response: [{ id, name, state }, ...]

POST /api/stacks/:id/:action
  Action: start | stop | redeploy
  Response: updated stack object
