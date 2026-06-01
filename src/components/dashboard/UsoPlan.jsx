import Tarjeta from "../ui/Tarjeta.jsx";

export default function UsoPlan({ plan, usadas, limite, total }) {
  const porcentaje = plan === "premium" ? 100 : Math.min(100, Math.round((usadas / limite) * 100));
  return (
    <Tarjeta className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-orange-50" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-orange-600">Plan actual</p>
            <h3 className="mt-1 text-xl font-black text-stone-900">Informe de uso del plan</h3>
          </div>
          <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-black uppercase text-white">{plan}</span>
        </div>
        <p className="mt-3 text-stone-600">{plan === "premium" ? `${total} recetas publicadas sin limite` : `${usadas}/${limite} recetas del plan plus`}</p>
        <div className="mt-5 flex items-center justify-between text-sm font-bold text-stone-500">
          <span>Uso disponible</span>
          <span>{porcentaje}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-100 shadow-inner">
          <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all" style={{ width: `${porcentaje}%` }} />
        </div>
      </div>
    </Tarjeta>
  );
}

