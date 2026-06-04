export default function Tarjeta({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-card sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}
