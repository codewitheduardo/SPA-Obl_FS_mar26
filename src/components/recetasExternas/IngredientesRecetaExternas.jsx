import { Check, ListChecks } from "lucide-react";
import { obtenerIngredientesMealDB } from "../../utils/mealdb.js";

export default function IngredientesRecetaExterna({ receta }) {
  const ingredientes = obtenerIngredientesMealDB(receta);

  return (
    <section className="rounded-2xl border border-sky-100 bg-sky-50 p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sky-700 shadow-sm">
          <ListChecks size={22} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">TheMealDB</p>
          <h2 className="text-2xl font-black text-stone-900">Ingredientes</h2>
        </div>
      </div>

      {ingredientes.length > 0 ? (
        <ul className="space-y-2">
          {ingredientes.map(({ ingrediente, medida }, indice) => (
            <li key={`${ingrediente}-${indice}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="flex items-center gap-3 font-bold text-stone-800">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-100 text-sky-700"><Check size={15} /></span>
                {ingrediente}
              </span>
              {medida && <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-500">{medida}</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl bg-white p-4 text-sm font-bold text-stone-600">La API no devolvio ingredientes para esta receta externa.</p>
      )}
    </section>
  );
}
