import { ChefHat, Clock, Edit, Eye, MessageCircle, Share2, Trash2, Users, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { formatearDificultad, obtenerEstilosDificultad } from "../../utils/formateadores.js";
import Boton from "../ui/Boton.jsx";
import Insignia from "../ui/Insignia.jsx";
import Tarjeta from "../ui/Tarjeta.jsx";
import { esRecetaBorrador } from "../../utils/recetas.js";

const camposImagenReceta = ["imagenUrl", "imagen"];
const camposUsuarioReceta = ["usuarioId", "usuario"];
const camposFotoUsuario = ["foto", "fotoUrl"];

const obtenerPrimerCampo = (objeto, campos) => campos.map((campo) => objeto?.[campo]).find(Boolean);

const obtenerUrlImagen = (receta) => obtenerPrimerCampo(receta, camposImagenReceta) || "";

const obtenerUsuarioReceta = (receta) =>
  camposUsuarioReceta.map((campo) => receta?.[campo]).find((usuario) => usuario && typeof usuario === "object") || null;

const obtenerId = (valor) => (typeof valor === "object" ? valor?._id || valor?.id || "" : valor || "");

const obtenerIdUsuarioReceta = (receta) => {
  return obtenerId(receta.usuarioId) || obtenerId(receta.usuario);
};

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
  const altoImagen = compacto ? "h-48" : "h-56";
  const paddingContenido = compacto ? "p-4 sm:p-5" : "p-5";
  const descripcion = compacto ? "line-clamp-2 min-h-[3.75rem]" : "line-clamp-3 min-h-[4.5rem]";
  const esBorrador = esRecetaBorrador(receta);

  useEffect(() => {
    setIndiceFotoAutor(0);
  }, [usuarioReceta?.foto, usuarioReceta?.fotoUrl]);

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
    <Tarjeta className="group flex h-full flex-col overflow-hidden p-0 ring-1 ring-transparent hover:-translate-y-1 hover:border-orange-200 hover:ring-orange-100">
      <div className="relative overflow-hidden rounded-t-2xl bg-orange-50">
        {imagen ? (
          <img src={imagen} alt={receta.titulo} className={`${altoImagen} w-full object-cover transition duration-500 group-hover:scale-[1.04]`} />
        ) : (
          <div className={`flex ${altoImagen} w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-orange-50 to-amber-50 text-center text-sm font-bold text-orange-700`}>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-orange-600 shadow-sm ring-1 ring-orange-100">
              <Utensils size={24} />
            </span>
            <span>Sin imagen cargada</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-stone-950/5 to-stone-950/35 opacity-90" />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-4">
          <Insignia className={obtenerEstilosDificultad(receta.dificultad)}>{formatearDificultad(receta.dificultad)}</Insignia>
          {editable && <Insignia className="bg-white/90 text-orange-700 shadow-sm">Mi receta</Insignia>}
          {esBorrador && <Insignia className="bg-stone-900 text-white shadow-sm">Borrador</Insignia>}
        </div>
      </div>
      <div className={`flex flex-1 flex-col ${paddingContenido}`}>
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-stone-500">
          {fotoAutor ? (
            <img
              src={fotoAutor}
              alt={autor}
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-orange-100"
              onError={() => setIndiceFotoAutor((actual) => actual + 1)}
            />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-50 text-orange-700 ring-1 ring-orange-100">{inicialAutor}</span>
          )}
          <span className="min-w-0 truncate">{editable ? "De " : "Por "}<span className="font-black text-stone-800">{autor}</span></span>
          <span className="text-stone-300">/</span>
          <span className="truncate">{categoria?.nombre || "Sin categoria"}</span>
        </div>
        <div className={`${compacto ? "mb-3" : "mb-3"} flex items-start justify-between gap-3`}>
          <div className="min-w-0">
            <h3 className={`${compacto ? "text-[1.18rem]" : "text-xl"} line-clamp-2 font-black leading-tight text-stone-900 transition group-hover:text-orange-700`}>{receta.titulo}</h3>
          </div>
        </div>

        <p className={`${descripcion} text-sm leading-6 text-stone-600`}>{receta.descripcion || "Esta receta todavia no tiene descripcion cargada."}</p>
        <div className={`${compacto ? "mt-3 text-sm" : "mt-4 text-sm"} grid grid-cols-3 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/50 font-semibold text-stone-600`}>
          <div className={`${compacto ? "py-2.5" : "py-3"} border-r border-stone-100 bg-white/50 px-3`}>
            <Clock size={compacto ? 14 : 16} className="mb-1 text-orange-600" />
            <p className="text-[10px] font-black uppercase tracking-wide text-stone-400">Tiempo</p>
            <span className="font-black text-stone-800">{receta.tiempoPreparacion || "-"} min</span>
          </div>
          <div className={`${compacto ? "py-2.5" : "py-3"} border-r border-stone-100 bg-white/30 px-3`}>
            <Users size={compacto ? 14 : 16} className="mb-1 text-orange-600" />
            <p className="text-[10px] font-black uppercase tracking-wide text-stone-400">Rinde</p>
            <span className="font-black text-stone-800">{receta.porciones || "-"} porc.</span>
          </div>
          <div className={`${compacto ? "py-2.5" : "py-3"} bg-white/50 px-3`}>
            <ChefHat size={compacto ? 14 : 16} className="mb-1 text-orange-600" />
            <p className="text-[10px] font-black uppercase tracking-wide text-stone-400">Tipo</p>
            <span className="line-clamp-1 font-black text-stone-800">{categoria?.nombre || "Sin categoria"}</span>
          </div>
        </div>

        <div className={`${compacto ? "pt-3" : "pt-4"} mt-auto border-t border-stone-100`}>
          {editable ? (
            <>
              <Link to={rutaDetalle}>
                <Boton variante="primario" className="w-full shadow-boton" type="button"><Eye size={16} /> Ver receta</Boton>
              </Link>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <Boton variante="outline" className="w-full px-3" type="button" onClick={() => onEditar?.(receta)} aria-label="Editar receta"><Edit size={16} /></Boton>
                <Boton variante="outline" className="w-full px-3" type="button" onClick={compartirReceta} disabled={esBorrador} aria-label="Compartir receta"><Share2 size={16} /></Boton>
                <Boton variante="outline" className="w-full border-rose-100 px-3 text-rose-600 hover:bg-rose-50" type="button" onClick={() => onEliminar?.(receta)} aria-label="Eliminar receta"><Trash2 size={16} /></Boton>
              </div>
            </>
          ) : (
            <>
              <Link to={rutaDetalle}>
                <Boton variante="primario" className="w-full shadow-boton" type="button"><Eye size={16} /> Ver receta</Boton>
              </Link>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to={`${rutaDetalle}#comentarios`}>
                  <Boton variante="fantasma" className="w-full rounded-2xl border border-stone-100 px-3 text-stone-600 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-700" type="button"><MessageCircle size={16} /> Comentar</Boton>
                </Link>
                <Boton variante="fantasma" className="w-full rounded-2xl border border-stone-100 px-3 text-stone-600 hover:border-orange-100 hover:bg-orange-50 hover:text-orange-700" type="button" onClick={compartirReceta}><Share2 size={16} /> Compartir</Boton>
              </div>
            </>
          )}
        </div>
      </div>
    </Tarjeta>
  );
}

