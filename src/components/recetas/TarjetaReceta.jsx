import { ChefHat, Clock, Edit, Eye, MessageCircle, Share2, Trash2, Users, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { formatearDificultad, obtenerEstilosDificultad } from "../../utils/formateadores.js";
import Boton from "../Boton.jsx";
import Insignia from "../Insignia.jsx";
import { esRecetaBorrador, obtenerId, obtenerIdAutorReceta, obtenerIdReceta, obtenerAutorReceta } from "../../utils/recetas.js";

const obtenerImagenReceta = (receta) => receta.imagenUrl || receta.imagen || "";

const obtenerFotosAutor = (autorReceta = {}, usuarioActual = {}, usarFotoActual = false) =>
  [autorReceta.foto, autorReceta.fotoUrl, ...(usarFotoActual ? [usuarioActual.foto, usuarioActual.fotoUrl] : [])]
    .filter(Boolean)
    .filter((url, indice, lista) => lista.indexOf(url) === indice);

const normalizarTexto = (valor) => String(valor || "").trim().toLowerCase();

const sonTextosIguales = (valorA, valorB) => {
  const textoA = normalizarTexto(valorA);
  const textoB = normalizarTexto(valorB);
  return Boolean(textoA && textoB && textoA === textoB);
};

const esUsuarioActual = (autorReceta, usuarioActual, autorId) => {
  const idActual = String(obtenerId(usuarioActual));
  const idAutor = String(autorId || obtenerId(autorReceta));
  if (idActual && idAutor && idActual === idAutor) return true;

  return (
    sonTextosIguales(autorReceta?.email || autorReceta?.correo, usuarioActual?.email || usuarioActual?.correo) ||
    sonTextosIguales(autorReceta?.nombre, usuarioActual?.nombre)
  );
};

export default function TarjetaReceta({ receta, categoria, usuarioActual, editable = false, compacto = false, onEditar, onEliminar }) {
  const [indiceFotoAutor, setIndiceFotoAutor] = useState(0);
  const imagen = obtenerImagenReceta(receta);
  const autorDesdeReceta = obtenerAutorReceta(receta);
  const autorId = String(obtenerIdAutorReceta(receta));
  const esRecetaPropia = editable || esUsuarioActual(autorDesdeReceta, usuarioActual, autorId);
  const autorReceta = esRecetaPropia ? { ...usuarioActual, ...autorDesdeReceta } : autorDesdeReceta;
  const autor = autorReceta?.nombre || "Comunidad";
  const fotosAutor = obtenerFotosAutor(autorReceta, usuarioActual, esRecetaPropia);
  const fotoAutor = fotosAutor[indiceFotoAutor] || "";
  const inicialAutor = autor?.charAt(0)?.toUpperCase() || "C";
  const recetaId = obtenerIdReceta(receta);
  const rutaDetalle = `/recetas/${recetaId}`;
  const altoImagen = compacto ? "h-40 sm:h-44" : "h-44 sm:h-52";
  const esBorrador = esRecetaBorrador(receta);

  useEffect(() => {
    setIndiceFotoAutor(0);
  }, [autorReceta?.foto, autorReceta?.fotoUrl]);

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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-card-hover">
      <div className={`relative overflow-hidden ${altoImagen} shrink-0`}>
        {imagen ? (
          <img
            src={imagen}
            alt={receta.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-stone-50 text-stone-300">
            <Utensils size={28} />
            <span className="text-xs text-stone-400">Sin imagen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Insignia className={obtenerEstilosDificultad(receta.dificultad)}>{formatearDificultad(receta.dificultad)}</Insignia>
          {editable && <Insignia className="bg-white/90 text-stone-700">Mi receta</Insignia>}
          {esBorrador && <Insignia className="bg-stone-900 text-white">Borrador</Insignia>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          {fotoAutor ? (
            <img
              src={fotoAutor}
              alt={autor}
              referrerPolicy="no-referrer"
              className="h-6 w-6 rounded-full object-cover ring-1 ring-stone-200"
              onError={() => setIndiceFotoAutor((actual) => actual + 1)}
            />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-700">
              {inicialAutor}
            </span>
          )}
          <span className="min-w-0 truncate text-xs text-stone-500">
            <span className="font-semibold text-stone-600">{autor}</span>
            {" / "}
            {categoria?.nombre || "Sin categoria"}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-[1.05rem] font-black leading-snug text-stone-900 transition-colors group-hover:text-orange-700">
          {receta.titulo}
        </h3>

        <p className="line-clamp-2 text-sm leading-6 text-stone-500">
          {receta.descripcion || "Esta receta todavia no tiene descripcion cargada."}
        </p>

        <div className="mt-4 grid grid-cols-3 divide-x divide-stone-100 rounded-xl border border-stone-100 bg-stone-50 text-center">
          <div className="px-2 py-2.5">
            <Clock size={12} className="mx-auto mb-1 text-orange-500" />
            <p className="text-[10px] text-stone-400">Tiempo</p>
            <p className="mt-0.5 text-xs font-bold text-stone-700">{receta.tiempoPreparacion || "-"} min</p>
          </div>
          <div className="px-2 py-2.5">
            <Users size={12} className="mx-auto mb-1 text-orange-500" />
            <p className="text-[10px] text-stone-400">Rinde</p>
            <p className="mt-0.5 text-xs font-bold text-stone-700">{receta.porciones || "-"} porc.</p>
          </div>
          <div className="px-2 py-2.5">
            <ChefHat size={12} className="mx-auto mb-1 text-orange-500" />
            <p className="text-[10px] text-stone-400">Tipo</p>
            <p className="mt-0.5 line-clamp-1 text-xs font-bold text-stone-700">{categoria?.nombre || "-"}</p>
          </div>
        </div>

        <div className="mt-4 border-t border-stone-100 pt-4">
          {editable ? (
            <>
              <Link to={rutaDetalle} className="block">
                <Boton variante="primario" className="w-full" type="button"><Eye size={15} /> Ver receta</Boton>
              </Link>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <Boton variante="outline" className="w-full px-2 py-2" type="button" onClick={() => onEditar?.(receta)}><Edit size={14} /></Boton>
                <Boton variante="outline" className="w-full px-2 py-2" type="button" onClick={compartirReceta} disabled={esBorrador}><Share2 size={14} /></Boton>
                <Boton variante="outline" className="w-full border-rose-100 px-2 py-2 text-rose-600 hover:bg-rose-50" type="button" onClick={() => onEliminar?.(receta)}><Trash2 size={14} /></Boton>
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
