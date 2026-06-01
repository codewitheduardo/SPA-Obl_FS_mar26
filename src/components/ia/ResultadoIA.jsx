import { ChefHat, Clock, RefreshCw, Users, WandSparkles } from "lucide-react";
import Boton from "../ui/Boton.jsx";
import EstadoVacio from "../ui/EstadoVacio.jsx";
import Tarjeta from "../ui/Tarjeta.jsx";

export default function ResultadoIA({ resultado, onUsar, onRegenerar, puedeGuardar = true }) {
  if (!resultado) {
    return (
      <Tarjeta className="flex min-h-[28rem] flex-col justify-center bg-white">
        <EstadoVacio titulo="Tu receta va a aparecer aca" texto="Completa los ingredientes y genera una propuesta para cocinar con lo que tenes." />
      </Tarjeta>
    );
  }

  const ingredientes = resultado.ingredientes?.length ? resultado.ingredientes : ["Revisar propuesta generada"];
  const pasos = resultado.pasos?.length ? resultado.pasos : [resultado.contenido];

  return (
    <Tarjeta className="overflow-hidden bg-white p-0">
      <div className="border-b border-stone-100 bg-stone-50/70 p-6">
        <p className="text-xs font-black uppercase tracking-wide text-stone-500">Resultado generado</p>
        <h2 className="mt-1 text-3xl font-black leading-tight text-stone-900">{resultado.titulo}</h2>
        <p className="mt-3 leading-7 text-stone-600">{resultado.descripcion}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-stone-100 bg-white p-3 shadow-sm">
            <Clock size={17} className="text-stone-500" />
            <p className="mt-1 text-xs font-black uppercase text-stone-400">Tiempo</p>
            <p className="font-black text-stone-900">{resultado.tiempoEstimado || "-"} min</p>
          </div>
          <div className="rounded-2xl border border-stone-100 bg-white p-3 shadow-sm">
            <Users size={17} className="text-stone-500" />
            <p className="mt-1 text-xs font-black uppercase text-stone-400">Porciones</p>
            <p className="font-black text-stone-900">{resultado.porciones || "-"}</p>
          </div>
          <div className="rounded-2xl border border-stone-100 bg-white p-3 shadow-sm">
            <ChefHat size={17} className="text-stone-500" />
            <p className="mt-1 text-xs font-black uppercase text-stone-400">Dificultad</p>
            <p className="font-black capitalize text-stone-900">{resultado.dificultad || "-"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-4">
          <h3 className="font-black text-stone-900">Ingredientes</h3>
          <ul className="mt-3 divide-y divide-stone-100 rounded-2xl border border-stone-100">
            {ingredientes.map((item) => <li key={item} className="px-3 py-2.5 text-sm font-semibold text-stone-700">{item}</li>)}
          </ul>
        </section>
        <section className="rounded-2xl border border-stone-200 bg-white p-4">
          <h3 className="font-black text-stone-900">Pasos</h3>
          <ol className="mt-3 space-y-2">
            {pasos.map((item, indice) => (
              <li key={`${item}-${indice}`} className="grid grid-cols-[2rem_1fr] gap-3 rounded-2xl border border-stone-100 bg-stone-50/70 px-3 py-2.5 text-sm leading-6 text-stone-700">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white font-black text-stone-600 ring-1 ring-stone-200">{indice + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="flex flex-col gap-2 border-t border-stone-100 bg-white p-5 sm:flex-row sm:justify-end">
        <Boton onClick={onUsar} disabled={!puedeGuardar}><WandSparkles size={18} /> Guardar como borrador</Boton>
        <Boton variante="outline" onClick={onRegenerar}><RefreshCw size={18} /> Regenerar</Boton>
      </div>
    </Tarjeta>
  );
}
