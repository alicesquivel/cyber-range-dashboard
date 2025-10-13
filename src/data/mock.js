export const mockServices = [
  { name: "DVWA", segment: "DMZ", status: "up", http: 200, latency: 23 },
  { name: "DNS", segment: "DMZ", status: "up", http: 200, latency: 18 },
  { name: "File Share", segment: "Server", status: "down", http: 503, latency: 0 },
  { name: "Internal API", segment: "Server", status: "up", http: 200, latency: 31 },
]

export const mockEvents = [
  { title: "OPNsense firewall: Blocked SQLi attempt", detail: "Rule: DMZ-WEB-001", time: "12:01:15" },
  { title: "Atomic Red Team: T1190 Exploit Public-Facing App", detail: "Injected payload blocked", time: "12:02:10" },
  { title: "Blue Team: Service restored", detail: "File Share back online", time: "12:05:44" },
]
