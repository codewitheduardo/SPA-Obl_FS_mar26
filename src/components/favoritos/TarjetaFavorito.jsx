import { ExternalLink, Globe2, Trash2, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import Boton from "../Boton.jsx";
import Insignia from "../Insignia.jsx";

export default function TarjetaFavorito({ favorito, onEliminar }) {
  const nombre = favorito.nombre || "Receta favorita";
  const categoria = favorito.categoria || "Sin categoria";
  const area = favorito.area || "Internacional";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-card-hover">
      {/* Imagen */}
      <div className="relative overflow-hidden">
        {favorito.imagenUrl ? (
          <img
            src={favorito.imagenUrl}
            alt={nombre}
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-44 w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-50 to-indigo-50 text-sky-300">
            <Utensils size={28} />
            <span className="text-xs font-semibold text-sky-400">Sin imagen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Insignia className="bg-orange-100/95 text-orange-700">Favorito</Insignia>
          <Insignia className="bg-sky-100/95 text-sky-700">TheMealDB</Insignia>
        </div>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-stone-700 shadow-sm backdrop-blur-sm">
          {area}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[1.05rem] font-black leading-snug text-stone-900">
          {nombre}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
          <Globe2 size={13} className="shrink-0" />
          <span className="font-medium">{area}</span>
          <span className="text-stone-300">/</span>
          <span className="truncate">{categoria}</span>
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <Link to={`/recetas-externas/${favorito.mealDbId}`} className="block">
            <Boton variante="outline" className="w-full px-3">
              <ExternalLink size={14} /> Ver
            </Boton>
          </Link>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
            onClick={() => onEliminar(favorito)}
          >
            <Trash2 size={14} /> Quitar
          </button>
        </div>
      </div>
    </article>
  );
}
