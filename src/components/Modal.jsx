export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-soft w-full max-w-lg">
          <div className="px-5 py-4 border-b border-slate-200 text-lg font-semibold">{title}</div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
