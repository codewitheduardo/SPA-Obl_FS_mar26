export default function AreaTexto({ label, error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-sm font-semibold text-stone-700">{label}</span>
      )}
      <textarea
        className={`min-h-28 w-full min-w-0 resize-y rounded-xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition-all duration-150 placeholder:text-stone-400 focus:ring-2 focus:ring-orange-200 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-stone-200 focus:border-orange-300"
        }`}
        {...props}
      />
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span>
      )}
    </label>
  );
}
