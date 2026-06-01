import { ExternalLink, Globe2, Trash2, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import Boton from "../ui/Boton.jsx";
import Insignia from "../ui/Insignia.jsx";
import Tarjeta from "../ui/Tarjeta.jsx";

export default function TarjetaFavorito({ favorito, onEliminar }) {
  const nombre = favorito.nombre || "Receta favorita";
  const categoria = favorito.categoria || "Sin categoria";
  const area = favorito.area || "Internacional";

  return (
    <Tarjeta className="group flex h-full flex-col overflow-hidden p-0 hover:-translate-y-1 hover:border-orange-200">
      <div className="relative overflow-hidden rounded-t-2xl bg-sky-50">
        {favorito.imagenUrl ? (
          <img src={favorito.imagenUrl} alt={nombre} className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        ) : (
          <div className="flex h-48 w-full flex-col items-center justify-center gap-3 text-sm font-bold text-sky-700">
            <Utensils size={28} />
            Sin imagen externa
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Insignia className="bg-orange-100/95 text-orange-700">Favorito</Insignia>
          <Insignia className="bg-sky-100/95 text-sky-700">TheMealDB</Insignia>
        </div>
        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-stone-700 shadow-sm">{area}</span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-xl font-black leading-tight text-stone-900">{nombre}</h3>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-stone-500">
          <Globe2 size={16} />
          <span>{area}</span>
          <span className="text-stone-300">/</span>
          <span>{categoria}</span>
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Link to={`/recetas-externas/${favorito.mealDbId}`}>
            <Boton variante="outline" className="w-full px-4"><ExternalLink size={16} /> Ver</Boton>
          </Link>
          <Boton variante="outline" className="w-full border-rose-100 px-4 text-rose-600 hover:bg-rose-50" onClick={() => onEliminar(favorito)}>
            <Trash2 size={16} /> Quitar
          </Boton>
        </div>
      </div>
    </Tarjeta>
  );
}
