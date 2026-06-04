import { joiResolver } from "@hookform/resolvers/joi";
import { CalendarDays, Edit, MessageCircle, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/api.js";
import { comentarioSchema } from "../../validators/comentarios.validators.js";
import AreaTexto from "../AreaTexto.jsx";
import Boton from "../Boton.jsx";
import MensajeError from "../MensajeError.jsx";
import { formatearFecha } from "../../utils/formateadores.js";

const obtenerEtiquetaValoracion = (valoracion) => {
  if (valoracion >= 5) return { texto: "Excelente", clases: "bg-emerald-50 text-emerald-700" };
  if (valoracion >= 4) return { texto: "Muy buena", clases: "bg-lime-50 text-lime-700" };
  if (valoracion >= 3) return { texto: "Correcta", clases: "bg-amber-50 text-amber-700" };
  return { texto: "A mejorar", clases: "bg-rose-50 text-rose-700" };
};

const obtenerFotoUsuarioComentario = (comentario) => {
  const usuarioComentario = comentario.usuario || {};
  return (
    usuarioComentario.fotoUrl ||
    usuarioComentario.foto ||
    comentario.usuarioFoto ||
    comentario.fotoUsuario ||
    ""
  );
};

export default function ComentariosReceta({ recetaId }) {
  const usuario = useSelector((state) => state.auth.usuario);
  const usuarioId = usuario?.id || usuario?._id;
  const [comentarios, setComentarios] = useState([]);
  const [promedioValoracion, setPromedioValoracion] = useState(0);
  const [error, setError] = useState(null);
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({ resolver: joiResolver(comentarioSchema), defaultValues: { valoracion: "" } });
  const valoracionFormulario = Number(watch("valoracion") || 0);

  const cargarComentarios = async () => {
    try {
      const respuesta = await api.get(`/recetas/${recetaId}/comentarios`);
      const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
      setComentarios(cuerpoRespuesta?.results || cuerpoRespuesta?.comentarios || []);
      setPromedioValoracion(cuerpoRespuesta?.promedioValoracion || 0);
      setError(null);
    } catch (errorApi) {
      setError(errorApi.message);
    }
  };

  useEffect(() => { cargarComentarios(); }, [recetaId]);

  const enviar = async (datos) => {
    try {
      const comentarioParaEnviar = { ...datos, valoracion: Number(datos.valoracion) };
      if (comentarioEditando) {
        await api.put(`/recetas/${recetaId}/comentarios/mio`, comentarioParaEnviar);
        setComentarioEditando(null);
        toast.success("Comentario actualizado");
      } else {
        const yaComento = comentarios.some((comentario) => (comentario.usuario?.id || comentario.usuario?._id || comentario.usuario) === usuarioId);
        if (yaComento) return toast.error("Ya valoraste esta receta");
        await api.post(`/recetas/${recetaId}/comentarios`, comentarioParaEnviar);
        toast.success("Comentario publicado");
      }
      reset({ texto: "", valoracion: "" });
      cargarComentarios();
    } catch (errorApi) {
      toast.error(errorApi.message || "No se pudo guardar el comentario");
    }
  };

  const eliminar = async (comentarioId) => {
    try {
      await api.delete(`/recetas/${recetaId}/comentarios/${comentarioId}`);
      toast.success("Comentario eliminado");
      cargarComentarios();
    } catch (errorApi) {
      toast.error(errorApi.message || "No se pudo eliminar el comentario");
    }
  };

  const prepararEdicion = (comentario) => {
    setComentarioEditando(comentario);
    reset({ texto: comentario.texto, valoracion: comentario.valoracion });
  };

  return (
    <section id="comentarios" className="mt-6 scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-5 shadow-card sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-600">
            <MessageCircle size={13} />
            Comunidad
          </div>
          <h2 className="mt-1.5 text-2xl font-black text-stone-900">Comentarios</h2>
          <p className="mt-1 text-sm text-stone-500">{comentarios.length} opiniones sobre esta receta</p>
        </div>
        <div className="flex flex-col items-end gap-1 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-2xl font-black text-stone-900">{Number(promedioValoracion || 0).toFixed(1)}</p>
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill={i < Math.round(promedioValoracion || 0) ? "currentColor" : "none"} />
            ))}
          </div>
          <p className="text-[10px] font-semibold text-stone-400">promedio</p>
        </div>
      </div>

      {/* Formulario */}
      <form className="mb-6 rounded-xl border border-stone-100 bg-stone-50 p-4 sm:p-5" onSubmit={handleSubmit(enviar)}>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold text-stone-900">{comentarioEditando ? "Editando tu valoracion" : "Dejá tu valoracion"}</p>
            <p className="mt-0.5 text-xs text-stone-500">Podés valorar esta receta una sola vez.</p>
          </div>
          <div className="flex items-center gap-0.5 rounded-xl bg-white px-3 py-2 shadow-card ring-1 ring-stone-100">
            {Array.from({ length: 5 }).map((_, indice) => {
              const valor = indice + 1;
              return (
                <button
                  key={valor}
                  type="button"
                  className="p-0.5 text-amber-400 transition hover:scale-110"
                  onClick={() => setValue("valoracion", valor, { shouldValidate: true })}
                  aria-label={`Valorar con ${valor}`}
                >
                  <Star size={22} fill={valor <= valoracionFormulario ? "currentColor" : "none"} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid min-w-0 gap-3 xl:grid-cols-[1fr_auto] xl:items-end">
          <AreaTexto label="Tu comentario" error={errors.texto?.message} {...register("texto")} />
          <input type="hidden" {...register("valoracion")} />
          <Boton className="w-full xl:w-auto" type="submit">
            {comentarioEditando ? "Actualizar" : "Publicar comentario"}
          </Boton>
        </div>
        {errors.valoracion?.message && (
          <p className="mt-2 text-xs font-medium text-rose-600">{errors.valoracion.message}</p>
        )}
      </form>

      <MensajeError mensaje={error} />

      {/* Lista */}
      <div className="space-y-3">
        {comentarios.length === 0 && (
          <p className="rounded-xl border border-dashed border-stone-200 bg-stone-50 p-6 text-center text-sm text-stone-500">
            Todavia no hay comentarios. Sé el primero en valorar esta receta.
          </p>
        )}
        {comentarios.map((comentario) => {
          const valoracion = Number(comentario.valoracion || 0);
          const etiqueta = obtenerEtiquetaValoracion(valoracion);
          const esPropio = (comentario.usuario?.id || comentario.usuario?._id || comentario.usuario) === usuarioId;
          const nombreUsuario = comentario.usuario?.nombre || usuario?.nombre || "Usuario";
          const fotoUsuario = obtenerFotoUsuarioComentario(comentario);
          const fecha = comentario.createdAt || comentario.updatedAt;

          return (
            <article
              key={comentario._id || comentario.id}
              className="rounded-xl border border-stone-100 bg-white p-4 shadow-card transition-all hover:border-stone-200 hover:shadow-card-hover"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  {fotoUsuario ? (
                    <img
                      src={fotoUsuario}
                      alt={nombreUsuario}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-stone-100"
                    />
                  ) : (
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 font-bold text-orange-700">
                      {nombreUsuario.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-stone-900">{nombreUsuario}</p>
                      {esPropio && (
                        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                          Tu comentario
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-stone-400">
                      <CalendarDays size={11} />
                      {formatearFecha(fecha)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${etiqueta.clases}`}>{etiqueta.texto}</span>
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                    <Star size={11} fill="currentColor" />
                    {valoracion.toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-700">{comentario.texto}</p>
              {esPropio && (
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <Boton variante="outline" className="px-3 py-1.5 text-xs" onClick={() => prepararEdicion(comentario)}>
                    <Edit size={13} /> Editar
                  </Boton>
                  <Boton variante="peligro" className="px-3 py-1.5 text-xs" onClick={() => eliminar(comentario._id || comentario.id)}>
                    <Trash2 size={13} /> Eliminar
                  </Boton>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
