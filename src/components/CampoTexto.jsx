export default function CampoTexto({ label, error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</span>
      )}
      <input
        className={`w-full min-w-0 rounded-xl border bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition-all duration-150 placeholder:text-stone-400 focus:ring-2 focus:ring-orange-200 focus:ring-offset-0 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-stone-200 focus:border-orange-300"
        }`}
        {...props}
      />
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600">
          {error}
        </span>
      )}
    </label>
  );
}
