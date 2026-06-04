import { Clock, MessageCircle, Share2, User, Users, Utensils } from "lucide-react";
import { toast } from "react-toastify";
import { formatearDificultad, obtenerEstilosDificultad } from "../../utils/formateadores.js";
import Boton from "../Boton.jsx";
import Insignia from "../Insignia.jsx";

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

  const stats = [
    { icon: Clock, label: "Tiempo", value: `${receta.tiempoPreparacion || "-"} min` },
    { icon: Users, label: "Porciones", value: `${receta.porciones || "-"} porc.` },
    { icon: User, label: "Autor", value: autor },
  ];

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card">
      <div className="grid lg:grid-cols-[minmax(18rem,22rem)_1fr]">
        {/* Imagen */}
        <div className="relative min-h-60 bg-stone-100 lg:min-h-full">
          {imagen ? (
            <img
              src={imagen}
              alt={receta.titulo}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-orange-50 to-amber-50 text-orange-300">
              <Utensils size={40} />
              <span className="text-sm font-semibold text-orange-400">Sin imagen</span>
            </div>
          )}
          {imagen && (
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent lg:bg-gradient-to-r" />
          )}
        </div>

        {/* Info */}
        <div className="p-6 sm:p-8">
          {/* Badges */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Insignia className={obtenerEstilosDificultad(receta.dificultad)}>
              {formatearDificultad(receta.dificultad)}
            </Insignia>
            <Insignia className="bg-stone-100 text-stone-600" title={nombreCategoria}>
              {nombreCategoria}
            </Insignia>
            <Insignia className="bg-orange-50 text-orange-700 ring-1 ring-orange-100">
              Cook Book
            </Insignia>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-black leading-tight tracking-tight text-stone-900 sm:text-4xl">
            {receta.titulo}
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-500">
            {receta.descripcion || "Esta receta todavia no tiene descripcion cargada."}
          </p>

          {/* Acciones */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <a href="#comentarios">
              <Boton variante="outline" type="button" className="px-5">
                <MessageCircle size={15} /> Comentar
              </Boton>
            </a>
            <Boton variante="outline" type="button" className="px-5" onClick={compartir}>
              <Share2 size={15} /> Compartir
            </Boton>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-orange-500 shadow-card ring-1 ring-stone-100">
                  <Icon size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">{label}</p>
                  <p className="truncate text-sm font-black text-stone-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
