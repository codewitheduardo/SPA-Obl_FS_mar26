import { joiResolver } from "@hookform/resolvers/joi";
import { CalendarDays, Edit, MessageCircle, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/api.js";
import { comentarioSchema } from "../../validators/comentarios.validators.js";
import AreaTexto from "../ui/AreaTexto.jsx";
import Boton from "../ui/Boton.jsx";
import MensajeError from "../ui/MensajeError.jsx";
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
    usuarioComentario.imagenUrl ||
    usuarioComentario.avatarUrl ||
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

  useEffect(() => {
    cargarComentarios();
  }, [recetaId]);

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
    <section id="comentarios" className="mt-8 scroll-mt-28 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600"><MessageCircle size={15} /> Comunidad</p>
          <h2 className="mt-1 text-2xl font-black text-stone-900">Comentarios</h2>
          <p className="text-stone-500">Opiniones y valoraciones de usuarios sobre esta receta interna.</p>
        </div>
        <div className="grid min-w-[12rem] gap-1 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-right">
          <p className="text-2xl font-black text-stone-900">{Number(promedioValoracion || 0).toFixed(1)}</p>
          <div className="flex justify-end text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} fill={i < Math.round(promedioValoracion || 0) ? "currentColor" : "none"} />)}</div>
          <p className="text-xs font-bold text-stone-500">{comentarios.length} comentarios</p>
        </div>
      </div>
      <form className="mb-6 rounded-2xl border border-stone-100 bg-stone-50 p-4" onSubmit={handleSubmit(enviar)}>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-black text-stone-900">{comentarioEditando ? "Editando tu valoracion" : "Deja tu valoracion"}</p>
            <p className="text-sm text-stone-500">Un usuario puede valorar esta receta una sola vez.</p>
          </div>
          <div className="flex items-center gap-1 rounded-2xl bg-white px-3 py-2 ring-1 ring-stone-100">
            {Array.from({ length: 5 }).map((_, indice) => {
              const valor = indice + 1;
              return (
                <button key={valor} type="button" className="text-amber-400 transition hover:scale-110" onClick={() => setValue("valoracion", valor, { shouldValidate: true })} aria-label={`Valorar con ${valor}`}>
                  <Star size={22} fill={valor <= valoracionFormulario ? "currentColor" : "none"} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-end">
          <AreaTexto label="Tu comentario" error={errors.texto?.message} {...register("texto")} />
          <input type="hidden" {...register("valoracion")} />
          <Boton className="w-full xl:w-auto" type="submit">{comentarioEditando ? "Actualizar comentario" : "Publicar comentario"}</Boton>
        </div>
        {errors.valoracion?.message && <p className="mt-2 text-sm text-rose-600">{errors.valoracion.message}</p>}
      </form>
      <MensajeError mensaje={error} />
      <div className="mt-4 grid gap-3">
        {comentarios.length === 0 && <p className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-5 text-center text-sm font-semibold text-stone-500">Todavia no hay comentarios. Se el primero en valorar esta receta.</p>}
        {comentarios.map((comentario) => {
          const valoracion = Number(comentario.valoracion || 0);
          const etiqueta = obtenerEtiquetaValoracion(valoracion);
          const esPropio = (comentario.usuario?.id || comentario.usuario?._id || comentario.usuario) === usuarioId;
          const nombreUsuario = comentario.usuario?.nombre || usuario?.nombre || "Usuario";
          const fotoUsuario = obtenerFotoUsuarioComentario(comentario);
          const fecha = comentario.createdAt || comentario.updatedAt;

          return (
            <article key={comentario._id || comentario.id} className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm transition hover:border-orange-100 hover:shadow-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  {fotoUsuario ? (
                    <img src={fotoUsuario} alt={nombreUsuario} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-orange-100" />
                  ) : (
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-50 font-black text-orange-700 ring-1 ring-orange-100">{nombreUsuario.charAt(0).toUpperCase()}</span>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-stone-900">{nombreUsuario}</p>
                      {esPropio && <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-black text-orange-700">Tu comentario</span>}
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-stone-400"><CalendarDays size={13} /> {formatearFecha(fecha)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-black ${etiqueta.clases}`}>{etiqueta.texto}</span>
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700"><Star size={14} fill="currentColor" /> {valoracion.toFixed(1)}</span>
                </div>
              </div>
              <p className="mt-3 rounded-2xl bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-700">{comentario.texto}</p>
              {esPropio && (
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <Boton variante="outline" className="px-3 py-2" onClick={() => prepararEdicion(comentario)}><Edit size={14} /> Editar</Boton>
                  <Boton variante="peligro" className="px-3 py-2" onClick={() => eliminar(comentario._id || comentario.id)}><Trash2 size={14} /> Eliminar</Boton>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
