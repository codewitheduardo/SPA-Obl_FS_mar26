import { Clock, MessageCircle, Share2, User, Users, Utensils } from "lucide-react";
import { toast } from "react-toastify";
import { formatearDificultad, obtenerEstilosDificultad } from "../../utils/formateadores.js";
import Boton from "../ui/Boton.jsx";
import Insignia from "../ui/Insignia.jsx";

export default function EncabezadoDetalleReceta({ receta, categoria }) {
  const imagen = receta.imagenUrl || receta.imagen;
  const autor = receta.usuarioId?.nombre || receta.usuario?.nombre || "Comunidad";
  const nombreCategoria = categoria?.nombre || "Sin categoria";

  const compartir = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      toast.success("Link de la receta copiado");
    } catch {
      toast.info(window.location.href.split("#")[0]);
    }
  };

  return (
    <section className="mb-8 grid overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:grid-cols-[minmax(16rem,23rem)_1fr]">
      <div className="relative min-h-64 bg-orange-50 lg:min-h-full">
        {imagen ? (
          <img src={imagen} alt={receta.titulo} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-orange-50 to-amber-50 text-base font-bold text-orange-700">
            <Utensils size={36} />
            Sin imagen cargada
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <Insignia className={obtenerEstilosDificultad(receta.dificultad)}>{formatearDificultad(receta.dificultad)}</Insignia>
              <Insignia className="max-w-[14rem] truncate bg-stone-100 text-stone-700" title={nombreCategoria}>{nombreCategoria}</Insignia>
              <Insignia className="bg-orange-100 text-orange-700">Cook Book</Insignia>
            </div>
            <h1 className="max-w-4xl text-3xl font-black leading-tight text-stone-900 sm:text-[2.35rem]">{receta.titulo}</h1>
            <p className="mt-2 max-w-3xl text-base leading-7 text-stone-600">{receta.descripcion || "Esta receta todavia no tiene descripcion cargada."}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a href="#comentarios">
              <Boton variante="outline" type="button" className="px-4"><MessageCircle size={16} /> Comentar</Boton>
            </a>
            <Boton variante="outline" type="button" className="px-4" onClick={compartir}><Share2 size={16} /> Compartir</Boton>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <article className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-orange-600 ring-1 ring-orange-100"><Clock size={18} /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Tiempo</p>
              <p className="truncate text-base font-black text-stone-900">{receta.tiempoPreparacion || "-"} min</p>
            </div>
          </article>
          <article className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-orange-600 ring-1 ring-orange-100"><Users size={18} /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Porciones</p>
              <p className="truncate text-base font-black text-stone-900">{receta.porciones || "-"} porciones</p>
            </div>
          </article>
          <article className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-orange-600 ring-1 ring-orange-100"><User size={18} /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Autor</p>
              <p className="truncate text-base font-black text-stone-900">{autor}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

