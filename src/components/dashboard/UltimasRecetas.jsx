import { ArrowRight, Clock, ChefHat, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatearDificultad, formatearFecha, obtenerEstilosDificultad } from "../../utils/formateadores.js";
import EstadoVacio from "../ui/EstadoVacio.jsx";
import Insignia from "../ui/Insignia.jsx";
import Tarjeta from "../ui/Tarjeta.jsx";

export default function UltimasRecetas({ recetas }) {
  const ultimas = recetas.slice(0, 4);

  return (
    <Tarjeta className="overflow-hidden">
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-orange-600">Actividad reciente</p>
          <h3 className="mt-1 text-xl font-black text-stone-900">Ultimas recetas</h3>
        </div>
        <Link to="/recetas" className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-700 hover:bg-orange-100">
          Ver todas <ArrowRight size={14} />
        </Link>
      </div>

      {ultimas.length === 0 ? (
        <EstadoVacio titulo="Sin recetas todavia" texto="Cuando la API devuelva recetas internas, vas a ver aca las publicaciones mas recientes." />
      ) : (
        <div className="space-y-3">
          {ultimas.map((receta) => {
            const imagen = receta.imagenUrl || receta.imagen;
            const autor = receta.usuarioId?.nombre || receta.usuario?.nombre || "Cook Book";
            const fecha = receta.createdAt || receta.updatedAt;

            return (
              <Link key={receta._id || receta.id} to={`/recetas/${receta._id || receta.id}`} className="group grid grid-cols-[82px_1fr] gap-4 rounded-2xl border border-stone-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-sm">
                {imagen ? (
                  <img src={imagen} alt={receta.titulo} className="h-20 w-20 rounded-2xl object-cover ring-1 ring-stone-100" />
                ) : (
                  <div className="grid h-20 w-20 place-items-center rounded-2xl bg-orange-50 text-orange-700 ring-1 ring-orange-100">
                    <ChefHat size={24} />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Insignia className={obtenerEstilosDificultad(receta.dificultad)}>{formatearDificultad(receta.dificultad)}</Insignia>
                    <span className="text-xs font-bold text-stone-400">{formatearFecha(fecha)}</span>
                  </div>
                  <p className="truncate text-base font-black text-stone-900 transition group-hover:text-orange-800">{receta.titulo}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">{receta.descripcion}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-stone-500">
                    <span className="inline-flex items-center gap-1"><Clock size={14} /> {receta.tiempoPreparacion || "-"} min</span>
                    <span className="inline-flex items-center gap-1"><Users size={14} /> {receta.porciones || "-"} porciones</span>
                    <span className="truncate">por {autor}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Tarjeta>
  );
}
