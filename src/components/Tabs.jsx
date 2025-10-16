export default function Tabs({ tabs, current, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map(t => (
        <button key={t}
          onClick={() => onChange(t)}
          className={
            "px-3 py-1.5 rounded-lg border " +
            (current === t ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 hover:bg-slate-100")
          }>{t}</button>
      ))}
    </div>
  )
}
