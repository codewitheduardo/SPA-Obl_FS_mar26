export default function Boton({ children, variante = "primario", className = "", ...props }) {
  const variantes = {
    primario: "bg-orange-500 text-white shadow-sm hover:bg-orange-600",
    secundario: "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600",
    outline: "border border-stone-200 bg-white text-stone-800 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-800",
    fantasma: "text-stone-600 hover:bg-stone-100",
    peligro: "bg-rose-500 text-white shadow-sm hover:bg-rose-600",
  };
  return (
    <button
      className={`inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-center text-sm font-semibold leading-tight transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variantes[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

