export default function Boton({ children, variante = "primario", className = "", ...props }) {
  const variantes = {
    primario:
      "bg-orange-500 text-white shadow-btn hover:bg-orange-600 active:bg-orange-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2",
    secundario:
      "bg-emerald-500 text-white shadow-btn hover:bg-emerald-600 active:bg-emerald-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
    outline:
      "border border-stone-200 bg-white text-stone-700 shadow-card hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2",
    fantasma:
      "text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2",
    peligro:
      "bg-rose-500 text-white shadow-btn hover:bg-rose-600 active:bg-rose-700 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2",
  };
  return (
    <button
      className={`inline-flex min-h-[2.5rem] max-w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-center text-sm font-semibold leading-tight transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${variantes[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
