import { Check, ChefHat, Clock, RefreshCw, Users, WandSparkles } from "lucide-react";
import { useState } from "react";
import Boton from "../Boton.jsx";
import EstadoVacio from "../EstadoVacio.jsx";

const COLORES_DIFICULTAD = {
  facil: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  media: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  dificil: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
};

const LABEL_DIFICULTAD = {
  facil: "Fácil",
  media: "Media",
  dificil: "Difícil",
};

export default function ResultadoIA({ resultado, categorias = [], onUsar, onRegenerar, puedeGuardar = true }) {
  const [categoriaId, setCategoriaId] = useState("");

  if (!resultado) {
    return (
      <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white">
        <EstadoVacio
          titulo="Tu receta va a aparecer acá"
          texto="Completá los ingredientes y hacé clic en Generar receta para ver la propuesta de la IA."
        />
      </div>
    );
  }

  const dificultadKey = resultado.dificultad || "facil";
  const categoriasDisponibles = Array.isArray(categorias) ? categorias : [];
  const idParaGuardar = categoriaId || categoriasDisponibles[0]?.id || categoriasDisponibles[0]?._id || "";

  const handleGuardar = () => onUsar?.(idParaGuardar);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card">

      {/* Header con datos del plato */}
      <div className="border-b border-stone-100 bg-gradient-to-br from-stone-50 to-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
              Resultado generado por IA
            </p>
            <h2 className="mt-1 text-2xl font-black leading-tight text-stone-900">
              {resultado.titulo}
            </h2>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${COLORES_DIFICULTAD[dificultadKey]}`}>
            {LABEL_DIFICULTAD[dificultadKey]}
          </span>
        </div>

        {resultado.descripcion && (
          <p className="mt-3 text-sm leading-6 text-stone-500">{resultado.descripcion}</p>
        )}

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-stone-100 bg-white p-3 shadow-card">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Clock size={16} />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Tiempo</p>
              <p className="text-sm font-black text-stone-900">{resultado.tiempoPreparacion} min</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-stone-100 bg-white p-3 shadow-card">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Users size={16} />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Porciones</p>
              <p className="text-sm font-black text-stone-900">{resultado.porciones} porc.</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-stone-100 bg-white p-3 shadow-card">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <ChefHat size={16} />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Nivel</p>
              <p className="text-sm font-black text-stone-900">{LABEL_DIFICULTAD[dificultadKey]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredientes + Pasos */}
      <div className="grid gap-5 p-5 md:grid-cols-2">

        {/* Ingredientes */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-black text-stone-900">Ingredientes</h3>
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
              {resultado.ingredientes.length} items
            </span>
          </div>
          <ul className="space-y-1.5">
            {resultado.ingredientes.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-stone-100 bg-stone-50 px-3 py-2"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Check size={9} />
                </span>
                <span className="text-sm text-stone-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Pasos */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-black text-stone-900">Pasos</h3>
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
              {resultado.pasos.length} pasos
            </span>
          </div>
          <ol className="space-y-2">
            {resultado.pasos.map((paso, i) => (
              <li key={i} className="flex gap-3 rounded-lg border border-stone-100 bg-stone-50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-black text-orange-700">
                  {i + 1}
                </span>
                <span className="text-sm leading-6 text-stone-700">{paso}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Footer — guardar */}
      {puedeGuardar && (
        <div className="border-t border-stone-100 bg-stone-50/60 p-5">
          <p className="mb-3 text-sm font-semibold text-stone-700">
            Guardá como borrador para seguir editando en{" "}
            <span className="text-orange-600">Mis recetas</span>
          </p>
          {categoriasDisponibles.length > 1 && (
            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-semibold text-stone-500">
                Categoría a asignar
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              >
                {categoriasDisponibles.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
          {categoriasDisponibles.length === 1 && (
            <p className="mb-3 rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-500">
              Se asignará a: <span className="font-semibold text-stone-700">{categoriasDisponibles[0].nombre}</span>
            </p>
          )}
          {categoriasDisponibles.length === 0 && (
            <p className="mb-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Necesitás tener al menos una categoría cargada para guardar la receta.
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Boton
              onClick={handleGuardar}
              disabled={categoriasDisponibles.length === 0}
              className="w-full sm:w-auto"
            >
              <WandSparkles size={16} />
              Guardar como borrador
            </Boton>
            <Boton variante="outline" onClick={onRegenerar} className="w-full sm:w-auto">
              <RefreshCw size={16} />
              Regenerar
            </Boton>
          </div>
        </div>
      )}

      {/* Footer sin permisos */}
      {!puedeGuardar && (
        <div className="border-t border-stone-100 p-5 text-right">
          <Boton variante="outline" onClick={onRegenerar}>
            <RefreshCw size={16} />
            Regenerar
          </Boton>
        </div>
      )}
    </div>
  );
}
