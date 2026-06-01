import { Check, ShoppingBasket } from "lucide-react";

export default function IngredientesReceta({ ingredientes }) {
  const lista = (Array.isArray(ingredientes) ? ingredientes : String(ingredientes || "").split(",")).map((item) => item.trim()).filter(Boolean);
  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:sticky lg:top-6">
      <div className="border-b border-stone-100 bg-orange-50 p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-700"><ShoppingBasket size={15} /> Lista de compras</p>
            <h2 className="mt-1 text-2xl font-black text-stone-900">Ingredientes</h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-orange-700 shadow-sm">{lista.length} items</span>
        </div>
        <p className="text-sm leading-6 text-stone-600">Prepara los ingredientes antes de empezar para seguir la receta con mas orden.</p>
      </div>

      <div className="p-4">
        {lista.length === 0 ? (
          <p className="rounded-2xl bg-stone-50 p-4 text-sm font-semibold text-stone-500">Esta receta todavia no tiene ingredientes cargados.</p>
        ) : (
          <ul className="grid gap-2">
            {lista.map((ingrediente, indice) => (
              <li key={`${indice}-${ingrediente}`} className="group flex items-start gap-3 rounded-2xl border border-stone-100 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-orange-100 hover:bg-orange-50/50">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700 ring-1 ring-orange-100 transition group-hover:bg-orange-100"><Check size={14} /></span>
                <span className="leading-6">{ingrediente}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

