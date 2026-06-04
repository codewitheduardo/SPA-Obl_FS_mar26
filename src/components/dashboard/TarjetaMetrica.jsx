export default function TarjetaMetrica({ titulo, valor, detalle, progreso = 0, icono: Icono, tono = "orange" }) {
  const tonos = {
    orange: { icono: "bg-orange-50 text-orange-600", barra: "bg-orange-500", accent: "text-orange-600" },
    emerald: { icono: "bg-emerald-50 text-emerald-600", barra: "bg-emerald-500", accent: "text-emerald-600" },
    amber: { icono: "bg-amber-50 text-amber-600", barra: "bg-amber-500", accent: "text-amber-600" },
    rose: { icono: "bg-rose-50 text-rose-600", barra: "bg-rose-500", accent: "text-rose-600" },
  };

  const estilos = tonos[tono];

  return (
    <article className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-stone-400">{titulo}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-stone-900">{valor}</p>
          {detalle && <p className="mt-1 truncate text-xs text-stone-400">{detalle}</p>}
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${estilos.icono}`}>
          <Icono size={20} />
        </div>
      </div>
      <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${estilos.barra}`}
          style={{ width: `${Math.max(4, Math.min(100, progreso))}%` }}
        />
      </div>
    </article>
  );
}
