export default function Tarjeta({ children, className = "" }) {
  return <section className={`rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 ${className}`}>{children}</section>;
}

