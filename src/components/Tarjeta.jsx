export default function Tarjeta({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}
