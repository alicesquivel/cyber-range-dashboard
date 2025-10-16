import { NavLink, Outlet, useLocation } from 'react-router-dom'

export default function Shell() {
  const loc = useLocation()
  const link = (to, label) => (
    <NavLink to={to} className={({isActive}) =>
      "px-3 py-2 rounded-lg " + (isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100")
    }>{label}</NavLink>
  )
  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Cyber Range in a Box</h1>
          <nav className="flex gap-3 items-center">
            {link("/", "Overview")}
            {link("/nodes", "Nodes & Network")}
            {link("/stacks", "Stacks")}
            {link("/telemetry", "Telemetry")}
            <a href="https://github.com/new" target="_blank" rel="noreferrer"
              className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">Create Repo</a>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500">
          © 2025 Cyber Range in a Box — Demo dashboard
        </div>
      </footer>
    </div>
  )
}
