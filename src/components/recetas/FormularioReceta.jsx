import { joiResolver } from "@hookform/resolvers/joi";
import { Image, ListChecks, Plus, Save, Settings2, Trash2, Utensils } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AreaTexto from "../ui/AreaTexto.jsx";
import Boton from "../ui/Boton.jsx";
import CajaSubidaImagen from "../ui/CajaSubidaImagen.jsx";
import CampoTexto from "../ui/CampoTexto.jsx";
import Selector from "../ui/Selector.jsx";
import { recetaSchema } from "../../validators/recetas.validators.js";
import { obtenerEstadoReceta } from "../../utils/recetas.js";

const normalizarListaFormulario = (valor, separador) => {
  const lista = Array.isArray(valor) ? valor : String(valor || "").split(separador);
  return lista
    .map((item) => {
      if (typeof item === "string") return item.trim();
      return String(item?.valor || item?.texto || item?.nombre || item?.descripcion || "").trim();
    })
    .filter(Boolean)
    .map((item) => ({ valor: item }));
};

const obtenerIdCategoria = (categoria) => {
  if (!categoria) return "";
  if (typeof categoria === "string") return categoria;
  return categoria._id || categoria.id || "";
};

const extraerMensajesErrores = (errores) => {
  if (!errores || typeof errores !== "object") return [];
  return Object.values(errores).flatMap((valor) => {
    if (!valor) return [];
    if (typeof valor.message === "string") return [valor.message];
    if (typeof valor === "object") return extraerMensajesErrores(valor);
    return [];
  });
};

const prepararValoresIniciales = (receta) => {
  if (!receta) return { dificultad: "facil", porciones: 2, tiempoPreparacion: 30, estado: "publicada", ingredientes: [{ valor: "" }], pasos: [{ valor: "" }] };
  const ingredientes = normalizarListaFormulario(receta.ingredientes, ",");
  const pasos = normalizarListaFormulario(receta.pasos, ".");

  return {
    titulo: receta.titulo || "Receta sin titulo",
    descripcion: receta.descripcion || "Receta guardada sin descripcion.",
    tiempoPreparacion: receta.tiempoPreparacion || 30,
    porciones: receta.porciones || 1,
    dificultad: receta.dificultad || "facil",
    categoriaId: obtenerIdCategoria(receta.categoriaId),
    estado: obtenerEstadoReceta(receta),
    ingredientes: ingredientes.length ? ingredientes : [{ valor: "Ingrediente pendiente" }],
    pasos: pasos.length ? pasos : [{ valor: "Paso pendiente" }],
  };
};

export default function FormularioReceta({ categorias, recetaInicial, onSubmit }) {
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: joiResolver(recetaSchema),
    defaultValues: prepararValoresIniciales(recetaInicial),
  });
  const ingredientesArray = useFieldArray({ control, name: "ingredientes" });
  const pasosArray = useFieldArray({ control, name: "pasos" });

  const enviar = (datos) => onSubmit?.({
    ...datos,
    ingredientes: datos.ingredientes.map((item) => item.valor.trim()).filter(Boolean),
    pasos: datos.pasos.map((item) => item.valor.trim()).filter(Boolean),
    imagen: datos.imagen?.[0],
  });

  const avisarErrores = (errores) => {
    const mensajes = extraerMensajesErrores(errores);

    toast.error(mensajes[0] || "Revisa los campos del formulario");
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(enviar, avisarErrores)}>
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3 border-b border-stone-100 pb-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700"><Utensils size={20} /></span>
          <div>
            <h3 className="font-black text-stone-900">Informacion principal</h3>
            <p className="text-sm text-stone-500">Datos visibles en comunidad, detalle o solo para vos.</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <CampoTexto label="Titulo" error={errors.titulo?.message} {...register("titulo")} />
          <Selector label="Categoria" error={errors.categoriaId?.message} {...register("categoriaId")}>
            <option value="">Seleccionar</option>
            {categorias.map((categoria) => <option key={categoria._id || categoria.id} value={categoria._id || categoria.id}>{categoria.nombre}</option>)}
          </Selector>
          <Selector label="Visibilidad" error={errors.estado?.message} {...register("estado")}>
            <option value="publicada">Publicada en comunidad</option>
            <option value="borrador">Borrador - solo yo</option>
          </Selector>
          <p className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 lg:col-span-2">
            Si elegis borrador, la receta queda en Mis recetas y no aparece en Comunidad.
          </p>
          <AreaTexto className="lg:col-span-2" label="Descripcion" error={errors.descripcion?.message} {...register("descripcion")} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700"><ListChecks size={20} /></span>
            <div>
              <h3 className="font-black text-stone-900">Ingredientes</h3>
              <p className="text-sm text-stone-500">Agrega cada ingrediente por separado.</p>
            </div>
          </div>
          <div className="space-y-2">
            {ingredientesArray.fields.map((campo, indice) => (
              <div key={campo.id} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <CampoTexto
                  label={indice === 0 ? "Ingrediente" : `Ingrediente ${indice + 1}`}
                  error={errors.ingredientes?.[indice]?.valor?.message}
                  placeholder="Ej: 2 huevos"
                  {...register(`ingredientes.${indice}.valor`)}
                />
                <Boton
                  variante="outline"
                  type="button"
                  className="self-end px-3"
                  onClick={() => ingredientesArray.fields.length > 1 ? ingredientesArray.remove(indice) : ingredientesArray.update(indice, { valor: "" })}
                  aria-label="Eliminar ingrediente"
                >
                  <Trash2 size={16} />
                </Boton>
              </div>
            ))}
            {typeof errors.ingredientes?.message === "string" && <p className="text-sm text-rose-600">{errors.ingredientes.message}</p>}
            <Boton variante="outline" type="button" className="w-full" onClick={() => ingredientesArray.append({ valor: "" })}>
              <Plus size={16} />
              Agregar ingrediente
            </Boton>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700"><ListChecks size={20} /></span>
            <div>
              <h3 className="font-black text-stone-900">Pasos</h3>
              <p className="text-sm text-stone-500">Crea una guia paso a paso.</p>
            </div>
          </div>
          <div className="space-y-2">
            {pasosArray.fields.map((campo, indice) => (
              <div key={campo.id} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <AreaTexto
                  label={`Paso ${indice + 1}`}
                  error={errors.pasos?.[indice]?.valor?.message}
                  placeholder="Ej: Mezclar todos los ingredientes"
                  {...register(`pasos.${indice}.valor`)}
                />
                <Boton
                  variante="outline"
                  type="button"
                  className="self-end px-3"
                  onClick={() => pasosArray.fields.length > 1 ? pasosArray.remove(indice) : pasosArray.update(indice, { valor: "" })}
                  aria-label="Eliminar paso"
                >
                  <Trash2 size={16} />
                </Boton>
              </div>
            ))}
            {typeof errors.pasos?.message === "string" && <p className="text-sm text-rose-600">{errors.pasos.message}</p>}
            <Boton variante="outline" type="button" className="w-full" onClick={() => pasosArray.append({ valor: "" })}>
              <Plus size={16} />
              Agregar paso
            </Boton>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700"><Settings2 size={20} /></span>
            <div>
              <h3 className="font-black text-stone-900">Datos de cocina</h3>
              <p className="text-sm text-stone-500">Tiempo, porciones y dificultad.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Tiempo de preparacion</span>
              <div className="flex overflow-hidden rounded-2xl border border-stone-200 bg-white transition focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
                <input className="min-w-0 flex-1 px-4 py-3 text-stone-900 outline-none" type="number" min="1" placeholder="Ej: 30" {...register("tiempoPreparacion")} />
                <span className="grid place-items-center border-l border-stone-200 bg-stone-50 px-4 text-sm font-black text-stone-500">min</span>
              </div>
              <span className="mt-1 block text-xs font-semibold text-stone-500">Ingresalo en minutos.</span>
              {errors.tiempoPreparacion?.message && <span className="mt-1 block text-sm text-rose-600">{errors.tiempoPreparacion.message}</span>}
            </label>
            <CampoTexto label="Porciones" type="number" error={errors.porciones?.message} {...register("porciones")} />
            <Selector className="sm:col-span-2" label="Dificultad" error={errors.dificultad?.message} {...register("dificultad")}>
              <option value="facil">Facil</option>
              <option value="media">Media</option>
              <option value="dificil">Dificil</option>
            </Selector>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3 border-b border-stone-100 pb-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700"><Image size={20} /></span>
            <div>
              <h3 className="font-black text-stone-900">Imagen</h3>
              <p className="text-sm text-stone-500">JPG, PNG o WEBP.</p>
            </div>
          </div>
          <CajaSubidaImagen folder="recetas" subirAutomaticamente previewInicial={recetaInicial?.imagenUrl} onChange={(archivo) => setValue("imagen", [archivo])} />
        </div>
      </section>

      <div className="sticky bottom-0 -mx-5 border-t border-stone-100 bg-white/95 px-5 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-col justify-end gap-3 sm:flex-row">
          <Boton type="submit" className="w-full sm:w-auto"><Save size={18} /> Guardar receta</Boton>
        </div>
      </div>
    </form>
  );
}


