import { useState } from 'react'
export default function RoleToggle({ value='Student', onChange }) {
  const [role, setRole] = useState(value)
  const click = (r) => { setRole(r); onChange && onChange(r) }
  const btn = (r) => (
    <button
      onClick={() => click(r)}
      className={
        "px-3 py-1 rounded-lg text-sm " +
        (role === r ? "bg-slate-900 text-white" : "bg-slate-100 hover:bg-slate-200")
      }>{r}</button>
  )
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">View as:</span>
      {btn('Student')}{btn('Instructor')}
    </div>
  )
}
