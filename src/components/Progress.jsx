export default function Progress({ value=0 }) {
  return (
    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
      <div className="h-full bg-slate-900" style={{ width: `${value}%`}}></div>
    </div>
  )
}
