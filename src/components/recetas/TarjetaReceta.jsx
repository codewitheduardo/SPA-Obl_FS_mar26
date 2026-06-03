import { ChefHat, Clock, Edit, Eye, MessageCircle, Share2, Trash2, Users, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { formatearDificultad, obtenerEstilosDificultad } from "../../utils/formateadores.js";
import Boton from "../Boton.jsx";
import Insignia from "../Insignia.jsx";
import { esRecetaBorrador } from "../../utils/recetas.js";

const camposImagenReceta = ["imagenUrl", "imagen"];
const camposUsuarioReceta = ["usuarioId", "usuario"];
const camposFotoUsuario = ["foto", "fotoUrl"];

const obtenerPrimerCampo = (objeto, campos) => campos.map((campo) => objeto?.[campo]).find(Boolean);
const obtenerUrlImagen = (receta) => obtenerPrimerCampo(receta, camposImagenReceta) || "";
const obtenerUsuarioReceta = (receta) =>
  camposUsuarioReceta.map((campo) => receta?.[campo]).find((usuario) => usuario && typeof usuario === "object") || null;

const obtenerId = (valor) => (typeof valor === "object" ? valor?._id || valor?.id || "" : valor || "");
const obtenerIdUsuarioReceta = (receta) => obtenerId(receta.usuarioId) || obtenerId(receta.usuario);

const obtenerFotosUsuario = (usuario = {}) =>
  camposFotoUsuario
    .map((campo) => usuario?.[campo])
    .filter(Boolean)
    .filter((url, indice, lista) => lista.indexOf(url) === indice);

const normalizarTexto = (valor) => String(valor || "").trim().toLowerCase();
const sonTextosIguales = (valorA, valorB) => {
  const textoA = normalizarTexto(valorA);
  const textoB = normalizarTexto(valorB);
  return Boolean(textoA && textoB && textoA === textoB);
};

const esMismoUsuario = (usuarioReceta, usuarioActual, autorId) => {
  const idActual = String(obtenerId(usuarioActual));
  const idAutor = String(autorId || obtenerId(usuarioReceta));
  if (idActual && idAutor && idActual === idAutor) return true;
  return (
    sonTextosIguales(usuarioReceta?.email || usuarioReceta?.correo, usuarioActual?.email || usuarioActual?.correo) ||
    sonTextosIguales(usuarioReceta?.nombre, usuarioActual?.nombre)
  );
};

export default function TarjetaReceta({ receta, categoria, usuarioActual, editable = false, compacto = false, onEditar, onEliminar }) {
  const [indiceFotoAutor, setIndiceFotoAutor] = useState(0);
  const imagen = obtenerUrlImagen(receta);
  const usuarioDesdeReceta = obtenerUsuarioReceta(receta);
  const autorId = String(obtenerIdUsuarioReceta(receta) || "");
  const usaPerfilActual = esMismoUsuario(usuarioDesdeReceta, usuarioActual, autorId) || editable;
  const usuarioReceta = usaPerfilActual ? { ...usuarioActual, ...usuarioDesdeReceta } : usuarioDesdeReceta;
  const autor = usuarioReceta?.nombre || "Comunidad";
  const fotosAutor = [
    ...obtenerFotosUsuario(usuarioReceta),
    ...(usaPerfilActual ? obtenerFotosUsuario(usuarioActual) : []),
  ].filter((url, indice, lista) => url && lista.indexOf(url) === indice);
  const fotoAutor = fotosAutor[indiceFotoAutor] || "";
  const inicialAutor = autor?.charAt(0)?.toUpperCase() || "C";
  const recetaId = receta._id || receta.id;
  const rutaDetalle = `/recetas/${recetaId}`;
  const altoImagen = compacto ? "h-44" : "h-52";
  const esBorrador = esRecetaBorrador(receta);

  useEffect(() => { setIndiceFotoAutor(0); }, [usuarioReceta?.foto, usuarioReceta?.fotoUrl]);

  const compartirReceta = async () => {
    const url = `${window.location.origin}${rutaDetalle}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link de la receta copiado");
    } catch {
      toast.info(url);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-card-hover">
      {/* Imagen */}
      <div className={`relative overflow-hidden ${altoImagen} shrink-0`}>
        {imagen ? (
          <img
            src={imagen}
            alt={receta.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-orange-50 to-amber-50 text-orange-300">
            <Utensils size={32} />
            <span className="text-xs font-semibold text-orange-400">Sin imagen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-stone-950/20" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Insignia className={obtenerEstilosDificultad(receta.dificultad)}>{formatearDificultad(receta.dificultad)}</Insignia>
          {editable && <Insignia className="bg-white/90 text-stone-700 shadow-sm">Mi receta</Insignia>}
          {esBorrador && <Insignia className="bg-stone-900 text-white">Borrador</Insignia>}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Autor */}
        <div className="mb-3 flex items-center gap-2">
          {fotoAutor ? (
            <img
              src={fotoAutor}
              alt={autor}
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full object-cover ring-2 ring-white shadow-sm"
              onError={() => setIndiceFotoAutor((actual) => actual + 1)}
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
              {inicialAutor}
            </span>
          )}
          <span className="min-w-0 truncate text-xs text-stone-500">
            <span className="font-semibold text-stone-700">{autor}</span>
            {" · "}
            <span>{categoria?.nombre || "Sin categoria"}</span>
          </span>
        </div>

        {/* Título y descripción */}
        <h3 className="mb-2 line-clamp-2 text-[1.05rem] font-black leading-snug text-stone-900 transition-colors group-hover:text-orange-700">
          {receta.titulo}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-stone-500">
          {receta.descripcion || "Esta receta todavia no tiene descripcion cargada."}
        </p>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-stone-50 px-2 py-2.5">
            <Clock size={13} className="mx-auto mb-1 text-orange-500" />
            <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Tiempo</p>
            <p className="mt-0.5 text-xs font-black text-stone-800">{receta.tiempoPreparacion || "-"} min</p>
          </div>
          <div className="rounded-xl bg-stone-50 px-2 py-2.5">
            <Users size={13} className="mx-auto mb-1 text-orange-500" />
            <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Rinde</p>
            <p className="mt-0.5 text-xs font-black text-stone-800">{receta.porciones || "-"} porc.</p>
          </div>
          <div className="rounded-xl bg-stone-50 px-2 py-2.5">
            <ChefHat size={13} className="mx-auto mb-1 text-orange-500" />
            <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Tipo</p>
            <p className="mt-0.5 line-clamp-1 text-xs font-black text-stone-800">{categoria?.nombre || "-"}</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-4 border-t border-stone-100 pt-4">
          {editable ? (
            <>
              <Link to={rutaDetalle} className="block">
                <Boton variante="primario" className="w-full" type="button"><Eye size={15} /> Ver receta</Boton>
              </Link>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <Boton variante="outline" className="w-full px-2" type="button" onClick={() => onEditar?.(receta)} aria-label="Editar receta"><Edit size={14} /></Boton>
                <Boton variante="outline" className="w-full px-2" type="button" onClick={compartirReceta} disabled={esBorrador} aria-label="Compartir receta"><Share2 size={14} /></Boton>
                <Boton variante="outline" className="w-full border-rose-100 px-2 text-rose-600 hover:bg-rose-50" type="button" onClick={() => onEliminar?.(receta)} aria-label="Eliminar receta"><Trash2 size={14} /></Boton>
              </div>
            </>
          ) : (
            <>
              <Link to={rutaDetalle} className="block">
                <Boton variante="primario" className="w-full" type="button"><Eye size={15} /> Ver receta</Boton>
              </Link>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to={`${rutaDetalle}#comentarios`} className="block">
                  <Boton variante="outline" className="w-full" type="button"><MessageCircle size={14} /> Comentar</Boton>
                </Link>
                <Boton variante="outline" className="w-full" type="button" onClick={compartirReceta}><Share2 size={14} /> Compartir</Boton>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
