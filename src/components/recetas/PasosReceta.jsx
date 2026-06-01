import { ListChecks, Timer } from "lucide-react";

export default function PasosReceta({ pasos }) {
  const lista = (Array.isArray(pasos) ? pasos : String(pasos || "").split(".")).map((item) => item.trim()).filter(Boolean);
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600"><ListChecks size={15} /> Preparacion</p>
          <h2 className="mt-1 text-2xl font-black text-stone-900">Pasos</h2>
          <p className="mt-1 text-sm text-stone-500">Seguí la preparación en orden para obtener el mejor resultado.</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-stone-50 px-3 py-1 text-xs font-black text-stone-600"><Timer size={14} /> {lista.length} pasos</span>
      </div>
      {lista.length === 0 ? (
        <p className="rounded-2xl bg-stone-50 p-4 text-sm font-semibold text-stone-500">Esta receta todavia no tiene pasos cargados.</p>
      ) : (
        <ol className="relative space-y-4 before:absolute before:left-5 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-orange-100">
          {lista.map((paso, indice) => (
            <li key={`${indice}-${paso}`} className="relative grid gap-3 rounded-2xl border border-stone-100 bg-white p-4 text-stone-700 transition hover:border-orange-100 hover:bg-orange-50/30 sm:grid-cols-[44px_1fr]">
              <span className="z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-100 font-black text-orange-700 ring-4 ring-white">{indice + 1}</span>
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-wide text-stone-400">Paso {indice + 1}</p>
                <p className="leading-7">{paso}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

