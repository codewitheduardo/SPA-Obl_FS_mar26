import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatearFecha } from "../../utils/formateadores.js";
import EstadoVacio from "../EstadoVacio.jsx";
import Tarjeta from "../Tarjeta.jsx";
import AvatarUsuario, { obtenerCandidatosFoto } from "../AvatarUsuario.jsx";

const obtenerEtiquetaValoracion = (valoracion) => {
  if (valoracion >= 5) return { texto: "Excelente", clases: "bg-emerald-50 text-emerald-700" };
  if (valoracion >= 4) return { texto: "Muy buena", clases: "bg-lime-50 text-lime-700" };
  if (valoracion >= 3) return { texto: "Correcta", clases: "bg-amber-50 text-amber-700" };
  return { texto: "A revisar", clases: "bg-rose-50 text-rose-700" };
};

export default function UltimosComentarios({ comentarios }) {
  const lista = Array.isArray(comentarios)
    ? comentarios.slice(0, 4)
    : Object.values(comentarios || {}).flat().slice(0, 4);

  return (
    <Tarjeta className="overflow-hidden">
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Valoraciones</p>
          <h3 className="mt-1 text-xl font-black text-stone-900">Ultimos comentarios</h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
          {lista.length} recientes
        </span>
      </div>

      {lista.length === 0 ? (
        <EstadoVacio
          titulo="Sin comentarios todavia"
          texto="Cuando los usuarios valoren recetas internas, vas a ver aca sus ultimos comentarios."
        />
      ) : (
        <div className="space-y-3">
          {lista.map((comentario) => {
            const valoracion = Number(comentario.valoracion || 0);
            const fecha = comentario.createdAt || comentario.updatedAt;
            const etiqueta = obtenerEtiquetaValoracion(valoracion);
            const receta = comentario.recetaOrigen || comentario.receta;
            const recetaId = receta?.id || receta?._id || comentario.recetaId;
            const tituloReceta = receta?.titulo || receta?.nombre;
            const nombreUsuario = comentario.usuario?.nombre || "Usuario";

            // Usa la misma función compartida para candidatos de foto
            const candidatosFoto = obtenerCandidatosFoto(comentario, null, false);

            return (
              <article
                key={comentario._id || comentario.id}
                className="rounded-xl border border-stone-100 bg-white p-4 transition hover:border-stone-200 hover:shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <AvatarUsuario
                      candidatos={candidatosFoto}
                      nombre={nombreUsuario}
                      ringClass="ring-2 ring-stone-100"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-stone-900">{nombreUsuario}</p>
                      <p className="text-xs text-stone-400">{formatearFecha(fecha)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${etiqueta.clases}`}>
                      {etiqueta.texto}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      {valoracion.toFixed(1)}
                      <span className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} fill={i < Math.round(valoracion) ? "currentColor" : "none"} />
                        ))}
                      </span>
                    </span>
                  </div>
                </div>

                {tituloReceta && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-stone-50 px-3 py-2">
                    <p className="flex min-w-0 items-center gap-2 text-sm text-stone-600">
                      <MessageCircle size={13} className="shrink-0 text-emerald-500" />
                      <span className="truncate">
                        En: <span className="font-semibold text-stone-800">{tituloReceta}</span>
                      </span>
                    </p>
                    {recetaId && (
                      <Link
                        to={`/recetas/${recetaId}`}
                        className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        Ver receta <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                )}

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{comentario.texto}</p>
              </article>
            );
          })}
        </div>
      )}
    </Tarjeta>
  );
}
