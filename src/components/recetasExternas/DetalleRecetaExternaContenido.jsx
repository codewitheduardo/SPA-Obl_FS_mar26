import { ExternalLink, Globe2, MessageSquareOff, PencilOff, ShieldCheck } from "lucide-react";
import Insignia from "../Insignia.jsx";
import IngredientesRecetaExterna from "./IngredientesRecetaExterna.jsx";

function obtenerPasos(instrucciones = "") {
  return instrucciones
    .split(/\r?\n|\.\s+/)
    .map((paso) => paso.trim())
    .filter((paso) => paso.length > 3)
    .map((paso) => (paso.endsWith(".") ? paso : `${paso}.`));
}

export default function DetalleRecetaExternaContenido({ receta }) {
  const imagen = receta.strMealThumb || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80";
  const nombre = receta.strMeal || "Receta externa";
  const area = receta.strArea || "Internacional";
  const categoria = receta.strCategory || "Sin categoria";
  const pasos = obtenerPasos(receta.strInstructions);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[420px_1fr]">
          <div className="relative min-h-80">
            <img src={imagen} alt={nombre} className="h-full min-h-80 w-full object-cover" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              <Insignia className="bg-sky-100/95 text-sky-700">TheMealDB</Insignia>
            </div>
          </div>
          <div className="p-6 lg:p-8">
            <p className="text-xs font-black uppercase tracking-wide text-orange-600">Receta externa</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-stone-900">{nombre}</h1>
            <p className="mt-3 max-w-2xl text-stone-600">Contenido importado desde TheMealDB. Se puede guardar como favorito externo, pero no se edita y no recibe comentarios dentro de Cook Book.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-stone-500"><Globe2 size={16} /> Area</p>
                <p className="mt-2 font-black text-stone-900">{area}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="flex items-center gap-2 text-xs font-black uppercase text-stone-500"><ShieldCheck size={16} /> Categoria</p>
                <p className="mt-2 font-black text-stone-900">{categoria}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
                <PencilOff size={18} />
                No tiene edicion como receta interna
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800">
                <MessageSquareOff size={18} />
                No muestra comentarios
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <IngredientesRecetaExterna receta={receta} />
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-orange-600">Preparacion</p>
              <h2 className="text-2xl font-black text-stone-900">Instrucciones originales</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700"><ExternalLink size={14} /> TheMealDB</span>
          </div>
          {pasos.length > 0 ? (
            <ol className="space-y-3">
              {pasos.map((paso, indice) => (
                <li key={`${paso}-${indice}`} className="grid gap-4 rounded-2xl border border-stone-100 bg-stone-50 p-4 sm:grid-cols-[44px_1fr]">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-sm font-black text-orange-700">{indice + 1}</span>
                  <p className="leading-7 text-stone-700">{paso}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-2xl bg-stone-50 p-4 text-stone-600">La API no devolvio instrucciones para esta receta externa.</p>
          )}
        </section>
      </div>
    </div>
  );
}
