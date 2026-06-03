import { ListChecks } from "lucide-react";

export default function PasosReceta({ pasos }) {
  const lista = (Array.isArray(pasos) ? pasos : String(pasos || "").split("."))
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-3 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-600">
            <ListChecks size={13} />
            Preparacion
          </div>
          <h2 className="mt-1.5 text-2xl font-black text-stone-900">Pasos</h2>
          <p className="mt-1 text-sm text-stone-500">Seguí la preparacion en orden para el mejor resultado.</p>
        </div>
        <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
          {lista.length} pasos
        </span>
      </div>

      {lista.length === 0 ? (
        <p className="rounded-xl bg-stone-50 p-4 text-sm text-stone-500">
          Esta receta todavia no tiene pasos cargados.
        </p>
      ) : (
        <ol className="space-y-3">
          {lista.map((paso, indice) => (
            <li
              key={`${indice}-${paso}`}
              className="group flex gap-4 rounded-xl border border-stone-100 p-4 transition-all hover:border-orange-100 hover:bg-orange-50/30"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-black text-orange-700 transition group-hover:bg-orange-200">
                {indice + 1}
              </span>
              <div className="min-w-0 pt-1">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Paso {indice + 1}
                </p>
                <p className="text-sm leading-7 text-stone-700">{paso}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
