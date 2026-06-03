import { Check, ShoppingBasket } from "lucide-react";

export default function IngredientesReceta({ ingredientes }) {
  const lista = (Array.isArray(ingredientes) ? ingredientes : String(ingredientes || "").split(","))
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card lg:sticky lg:top-6">
      <div className="border-b border-stone-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-600">
              <ShoppingBasket size={13} />
              Lista de compras
            </div>
            <h2 className="mt-1.5 text-2xl font-black text-stone-900">Ingredientes</h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-600 shadow-card">
            {lista.length} items
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Preparalos antes de empezar para seguir la receta con más orden.
        </p>
      </div>

      <div className="p-4">
        {lista.length === 0 ? (
          <p className="rounded-xl bg-stone-50 p-4 text-sm text-stone-500">
            Esta receta todavia no tiene ingredientes cargados.
          </p>
        ) : (
          <ul className="space-y-2">
            {lista.map((ingrediente, indice) => (
              <li
                key={`${indice}-${ingrediente}`}
                className="group flex items-start gap-3 rounded-xl border border-stone-100 bg-white px-4 py-3 text-sm text-stone-700 transition-all hover:border-orange-100 hover:bg-orange-50/40"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition group-hover:bg-orange-200">
                  <Check size={11} />
                </span>
                <span className="leading-6 font-medium">{ingrediente}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
