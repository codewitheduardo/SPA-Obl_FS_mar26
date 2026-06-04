import { joiResolver } from "@hookform/resolvers/joi";
import { Clock, Flame, Leaf, Sparkles, Utensils, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import AreaTexto from "../AreaTexto.jsx";
import Boton from "../Boton.jsx";
import CampoTexto from "../CampoTexto.jsx";
import Selector from "../Selector.jsx";
import { iaSchema } from "../../validators/ia.validators.js";

const TIPOS_COMIDA = [
  { value: "", label: "Cualquier tipo" },
  { value: "desayuno", label: "Desayuno" },
  { value: "almuerzo", label: "Almuerzo" },
  { value: "merienda", label: "Merienda" },
  { value: "cena", label: "Cena" },
  { value: "entrada", label: "Entrada" },
  { value: "postre", label: "Postre" },
  { value: "snack", label: "Snack" },
];

const CHIPS_INGREDIENTES = [
  { label: "Pollo + arroz", value: "200g de pechuga de pollo, 1 taza de arroz, cebolla, pimiento rojo" },
  { label: "Pasta + tomate", value: "200g de pasta corta, tomates, ajo, albahaca, queso rallado" },
  { label: "Lentejas", value: "1 taza de lentejas, zanahoria, cebolla, tomate, pimentón" },
  { label: "Huevos + papa", value: "4 huevos, 2 papas medianas, cebolla, aceite de oliva" },
  { label: "Carne + verduras", value: "300g de carne picada, zapallito, tomate, cebolla, ajo" },
];

export default function FormularioIA({ onGenerar, cargando }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(iaSchema),
    defaultValues: {
      dificultad: "facil",
      tiempoMaximo: 30,
      porciones: 2,
      tipoComida: "",
      preferencias: "",
      ingredientes: "",
    },
  });

  const ingredientesActuales = watch("ingredientes") || "";

  const agregarChip = (valor) => {
    setValue("ingredientes", valor, { shouldValidate: true });
  };

  return (
    <form
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card"
      onSubmit={handleSubmit(onGenerar)}
    >
      {/* Header */}
      <div className="border-b border-stone-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-600">
          <Sparkles size={13} />
          Asistente de cocina — IA
        </p>
        <h2 className="mt-1 text-xl font-black text-stone-900">
          Decile qué tenés en la heladera
        </h2>
        <p className="mt-1 text-sm leading-6 text-stone-500">
          Cuanto más detallado seas, mejor resultado obtenés. La IA genera una
          receta completa y estructurada.
        </p>
      </div>

      <div className="space-y-5 p-5">

        {/* Ingredientes */}
        <div>
          <AreaTexto
            label="Ingredientes disponibles *"
            placeholder="Ej: 2 pechugas de pollo, 1 taza de arroz, cebolla, pimiento rojo, ajo"
            error={errors.ingredientes?.message}
            {...register("ingredientes")}
          />
          <p className="mt-1.5 text-xs text-stone-400">
            Separalos con comas. Incluí cantidades si las conocés para una receta más precisa.
          </p>
          {/* Chips de ejemplo */}
          <div className="mt-2 flex max-w-full flex-wrap gap-1.5">
            {CHIPS_INGREDIENTES.map(({ label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => agregarChip(value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  ingredientesActuales === value
                    ? "border-orange-300 bg-orange-100 text-orange-700"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo + Porciones */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Selector
            label="Tipo de comida"
            {...register("tipoComida")}
          >
            {TIPOS_COMIDA.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Selector>

          <Selector label="Porciones" {...register("porciones")}>
            {[1, 2, 3, 4, 5, 6, 8].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "porción" : "porciones"}</option>
            ))}
          </Selector>
        </div>

        {/* Tiempo + Dificultad */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-stone-700">
              <Clock size={14} className="text-stone-400" />
              Tiempo máximo
            </span>
            <div className="flex overflow-hidden rounded-xl border border-stone-200 bg-white transition focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
              <input
                type="number"
                min="5"
                max="180"
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-stone-900 outline-none"
                {...register("tiempoMaximo")}
              />
              <span className="flex items-center border-l border-stone-100 bg-stone-50 px-3 text-xs font-bold text-stone-400">
                min
              </span>
            </div>
            {errors.tiempoMaximo?.message && (
              <span className="mt-1 block text-xs text-rose-600">{errors.tiempoMaximo.message}</span>
            )}
          </label>

          <Selector
            label="Dificultad"
            {...register("dificultad")}
          >
            <option value="facil">Fácil</option>
            <option value="media">Media</option>
            <option value="dificil">Difícil</option>
          </Selector>
        </div>

        {/* Preferencias */}
        <div>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-stone-700">
              <Leaf size={14} className="text-stone-400" />
              Restricciones o preferencias
              <span className="font-normal text-stone-400">(opcional)</span>
            </span>
            <input
              type="text"
              placeholder="Ej: sin gluten, vegetariana, sin lácteos, baja en sodio..."
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              {...register("preferencias")}
            />
          </label>
        </div>

        {/* Footer con tip y botón */}
        <div className="flex flex-col gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm text-stone-600">
            <Flame size={15} className="mt-0.5 shrink-0 text-orange-500" />
            <span>
              Cuanto más detallados los ingredientes con cantidades, mejor calidad tiene la receta generada.
            </span>
          </p>
          <Boton type="submit" disabled={cargando} className="w-full shrink-0 sm:w-auto">
            <Sparkles size={16} />
            {cargando ? "Generando..." : "Generar receta"}
          </Boton>
        </div>

      </div>
    </form>
  );
}
