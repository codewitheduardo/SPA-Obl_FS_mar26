export default function MensajeError({ mensaje }) {
  if (!mensaje) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1L1 11h10L6 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6 5v3M6 9.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <p className="text-sm font-medium text-rose-700">{mensaje}</p>
    </div>
  );
}
