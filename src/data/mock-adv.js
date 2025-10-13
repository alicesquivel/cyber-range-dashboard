export const vlanProfile = { dmz: 10, server: 20, client: 30, internet: 40 }
export const nodes = [
  { name: "DMZ", ip: "10.10.10.10", vlan: 10, status: "Active", cpu: 41, temp: 54 },
  { name: "Server", ip: "10.20.20.20", vlan: 20, status: "Stable", cpu: 36, temp: 52 },
  { name: "Client", ip: "10.30.30.30", vlan: 30, status: "Warning", cpu: 63, temp: 60 },
  { name: "Simulated Internet", ip: "198.51.100.5", vlan: 40, status: "Active", cpu: 29, temp: 49 },
  { name: "Router (OPNsense)", ip: "10.0.0.1", vlan: 1, status: "OK", cpu: 22, temp: 47 },
]
export const scoreboard = { uptime: 820, penalties: -120, bonus: 40 }
export const readiness = [
  { team: "Red Team", pct: 70 },
  { team: "Blue Team", pct: 90 },
  { team: "Yellow Team", pct: 60 },
  { team: "White Team", pct: 100 }
]
export const stacks = [
  { name: "DVWA (Web Exploitation)", desc: "Deployed to DMZ Pi with scoring checks." },
  { name: "DNS Misconfig Lab", desc: "Authoritative/recursive mix-up; tampering scenario." },
  { name: "Privilege Escalation", desc: "Sudoedit path abuse; log/score hooks." },
]
