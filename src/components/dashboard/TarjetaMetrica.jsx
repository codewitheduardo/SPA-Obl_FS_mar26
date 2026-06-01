export default function TarjetaMetrica({ titulo, valor, detalle, progreso = 0, icono: Icono, tono = "orange" }) {
  const tonos = {
    orange: "bg-orange-50 text-orange-700 ring-orange-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  };
  return (
    <section className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-stone-500">{titulo}</p>
          <p className="mt-1 text-3xl font-black text-stone-900">{valor}</p>
          {detalle && <p className="mt-1 text-xs font-semibold text-stone-400">{detalle}</p>}
        </div>
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 transition group-hover:scale-105 ${tonos[tono]}`}><Icono size={24} /></div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-orange-400 transition-all" style={{ width: `${Math.max(8, Math.min(100, progreso))}%` }} />
      </div>
    </section>
  );
}

