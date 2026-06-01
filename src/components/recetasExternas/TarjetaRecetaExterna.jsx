import { BadgeCheck, Globe2, Heart, Search, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import Boton from "../Boton.jsx";
import Insignia from "../Insignia.jsx";
import Tarjeta from "../Tarjeta.jsx";

export default function TarjetaRecetaExterna({ receta, esFavorita, onFavorito }) {
  const imagen = receta.strMealThumb || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=900&q=80";
  const nombre = receta.strMeal || "Receta externa";
  const area = receta.strArea || "Internacional";
  const categoria = receta.strCategory || "Sin categoria";

  return (
    <Tarjeta className="group overflow-hidden p-0">
      <div className="relative">
        <img src={imagen} alt={nombre} className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Insignia className="bg-sky-100/95 text-sky-700">TheMealDB</Insignia>
          {esFavorita && <Insignia className="bg-orange-100/95 text-orange-700">Favorita</Insignia>}
        </div>
        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-stone-700 shadow-sm">{area}</span>
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <Insignia className="bg-emerald-100 text-emerald-700">Receta internacional</Insignia>
          <Insignia className="bg-stone-100 text-stone-700">{categoria}</Insignia>
        </div>
        <h3 className="line-clamp-2 text-xl font-black leading-tight text-stone-900">{nombre}</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-stone-50 px-3 py-2">
            <p className="flex items-center gap-2 font-bold text-stone-500"><Globe2 size={15} /> Area</p>
            <p className="mt-1 font-black text-stone-800">{area}</p>
          </div>
          <div className="rounded-2xl bg-stone-50 px-3 py-2">
            <p className="flex items-center gap-2 font-bold text-stone-500"><Utensils size={15} /> Tipo</p>
            <p className="mt-1 font-black text-stone-800">{categoria}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={`/recetas-externas/${receta.idMeal}`} className="flex-1">
            <Boton variante="outline" className="w-full px-4"><Search size={16} /> Ver detalle</Boton>
          </Link>
          <Boton variante={esFavorita ? "secundario" : "primario"} className="flex-1 px-4" disabled={esFavorita} onClick={() => onFavorito?.(receta)}>
            {esFavorita ? <BadgeCheck size={16} /> : <Heart size={16} />}
            {esFavorita ? "Guardada" : "Favorito"}
          </Boton>
        </div>
      </div>
    </Tarjeta>
  );
}
