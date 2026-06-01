import { joiResolver } from "@hookform/resolvers/joi";
import { Clock, Flame, Leaf, Sparkles, Utensils } from "lucide-react";
import { useForm } from "react-hook-form";
import AreaTexto from "../AreaTexto.jsx";
import Boton from "../Boton.jsx";
import CampoTexto from "../CampoTexto.jsx";
import Selector from "../Selector.jsx";
import { iaSchema } from "../../validators/ia.validators.js";

const ideasRapidas = ["pollo, arroz, morron", "pasta, tomate, queso", "lentejas, cebolla, zanahoria"];

export default function FormularioIA({ onGenerar, cargando }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(iaSchema),
    defaultValues: { dificultad: "facil", tiempoMaximo: 30 },
  });

  return (
    <form className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm" onSubmit={handleSubmit(onGenerar)}>
      <div className="border-b border-orange-100 bg-orange-50/70 p-5">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-orange-700"><Sparkles size={15} /> Asistente de cocina</p>
        <h2 className="mt-1 text-2xl font-black text-stone-900">Decile que tenes en la heladera</h2>
        <p className="mt-1 text-sm leading-6 text-stone-600">La IA arma una idea de receta y despues podes guardarla como borrador si tu usuario es chef.</p>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <AreaTexto label="Ingredientes disponibles" placeholder="Ej: pollo, arroz, cebolla, crema" error={errors.ingredientes?.message} {...register("ingredientes")} />
          <div className="mt-3 flex flex-wrap gap-2">
            {ideasRapidas.map((idea) => (
              <button key={idea} type="button" onClick={() => setValue("ingredientes", idea, { shouldValidate: true })} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600 transition hover:bg-orange-100 hover:text-orange-700">
                {idea}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-700"><Utensils size={16} /> Tipo de comida</p>
          <CampoTexto label="" placeholder="almuerzo, cena, postre" {...register("tipoComida")} />
        </div>
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-700"><Clock size={16} /> Tiempo maximo</p>
          <CampoTexto label="" type="number" {...register("tiempoMaximo")} />
        </div>
        <Selector label="Dificultad deseada" {...register("dificultad")}>
          <option value="facil">Facil</option>
          <option value="media">Media</option>
          <option value="dificil">Dificil</option>
        </Selector>
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-700"><Leaf size={16} /> Preferencias o restricciones</p>
          <CampoTexto label="" placeholder="sin gluten, vegetariana..." {...register("preferencias")} />
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-stone-600"><Flame size={17} className="text-orange-600" /> Mientras mas concreto seas, mejor sale la receta.</p>
          <Boton type="submit" disabled={cargando} className="w-full sm:w-auto"><Sparkles size={18} /> {cargando ? "Generando..." : "Generar receta"}</Boton>
        </div>
      </div>
    </form>
  );
}
