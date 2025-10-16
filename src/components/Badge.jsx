export default function Badge({ children, tone='default' }) {
  const map = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700"
  }
  return (
    <span className={"px-2 py-1 rounded-lg text-xs " + (map[tone] || map.default)}>{children}</span>
  )
}
