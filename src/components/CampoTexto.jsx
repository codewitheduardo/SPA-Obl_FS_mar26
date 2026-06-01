export default function CampoTexto({ label, error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <input className="w-full min-w-0 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100" {...props} />
      {error && <span className="mt-1 block text-sm text-rose-600">{error}</span>}
    </label>
  );
}

