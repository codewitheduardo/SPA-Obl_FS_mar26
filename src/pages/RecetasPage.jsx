import { BookOpen, ChefHat, Clock, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import api from "../api/api.js";
import FiltrosRecetas from "../components/recetas/FiltrosRecetas.jsx";
import TarjetaReceta from "../components/recetas/TarjetaReceta.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import MensajeError from "../components/MensajeError.jsx";
import { actualizarFiltrosRecetas, guardarErrorRecetas, guardarRecetas, iniciarCargaRecetas } from "../features/recetasSlice.js";

const textoIngredientes = (ingredientes) => (Array.isArray(ingredientes) ? ingredientes.join(" ") : String(ingredientes || ""));
const idCategoriaReceta = (receta) => receta.categoriaId?._id || receta.categoriaId;
const extraerRecetas = (respuesta) => {
  const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
  return cuerpoRespuesta?.results || cuerpoRespuesta || [];
};
const extraerLista = (respuesta) => {
  const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
  return cuerpoRespuesta?.results || cuerpoRespuesta?.usuarios || cuerpoRespuesta || [];
};
const obtenerIdUsuario = (usuario) => String(usuario?._id || usuario?.id || "");
const completarUsuarioAutor = ({ receta, recetaPropia, usuarioActual, usuarios }) => {
  const autorDesdeUsuario = typeof receta.usuario === "object" ? receta.usuario : null;
  const autorDesdeUsuarioId = typeof receta.usuarioId === "object" ? receta.usuarioId : null;
  const autorBase = autorDesdeUsuario || autorDesdeUsuarioId || null;
  const autorId = autorBase?._id || autorBase?.id || receta.usuarioId || receta.usuario || receta.autorId || "";
  const usuarioEncontradoPorId = usuarios.find((usuario) => obtenerIdUsuario(usuario) === String(autorId || ""));
  const esUsuarioActual = autorId && (String(usuarioActual?._id || usuarioActual?.id || "") === String(autorId));

  if (autorBase || usuarioEncontradoPorId || esUsuarioActual || recetaPropia) {
    return {
      ...(esUsuarioActual ? usuarioActual : {}),
      ...(usuarioEncontradoPorId || {}),
      ...(recetaPropia?.usuario || {}),
      ...(typeof recetaPropia?.usuarioId === "object" ? recetaPropia.usuarioId : {}),
      ...(autorBase || {}),
    };
  }
  return null;
};

export default function Recetas() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items, misRecetas, filtros, cargando, error } = useSelector((state) => state.recetas);
  const categorias = useSelector((state) => state.categorias.items);
  const usuario = useSelector((state) => state.auth.usuario);
  const [usuarios, setUsuarios] = useState([]);
  const busquedaGeneral = searchParams.get("buscar")?.toLowerCase() || "";

  useEffect(() => {
    const cargarRecetas = async () => {
      try {
        dispatch(iniciarCargaRecetas());
        const respuesta = await api.get("/recetas");
        dispatch(guardarRecetas(extraerRecetas(respuesta)));
      } catch (error) {
        dispatch(guardarErrorRecetas(error.message));
      }
    };
    cargarRecetas();
  }, [dispatch]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const respuesta = await api.get("/usuarios");
        const usuariosRespuesta = extraerLista(respuesta);
        setUsuarios(Array.isArray(usuariosRespuesta) ? usuariosRespuesta : []);
      } catch {
        setUsuarios([]);
      }
    };
    cargarUsuarios();
  }, []);

  const recetasFiltradas = items.filter((receta) =>
    (!busquedaGeneral ||
      receta.titulo.toLowerCase().includes(busquedaGeneral) ||
      textoIngredientes(receta.ingredientes).toLowerCase().includes(busquedaGeneral) ||
      (receta.categoriaId?.nombre || categorias.find((c) => c.id === idCategoriaReceta(receta) || c._id === idCategoriaReceta(receta))?.nombre || "").toLowerCase().includes(busquedaGeneral)) &&
    receta.titulo.toLowerCase().includes(filtros.titulo.toLowerCase()) &&
    (!filtros.categoriaId || idCategoriaReceta(receta) === filtros.categoriaId) &&
    (!filtros.dificultad || receta.dificultad === filtros.dificultad) &&
    (!filtros.tiempoMaximo || Number(receta.tiempoPreparacion) <= Number(filtros.tiempoMaximo)) &&
    (!filtros.ingrediente || textoIngredientes(receta.ingredientes).toLowerCase().includes(filtros.ingrediente.toLowerCase())),
  );

  const tiempoPromedio = items.length
    ? Math.round(items.reduce((total, receta) => total + Number(receta.tiempoPreparacion || 0), 0) / items.length)
    : 0;

  const metricas = [
    { titulo: "Publicadas", valor: items.length, icono: BookOpen, color: "orange" },
    { titulo: "Visibles", valor: recetasFiltradas.length, icono: ChefHat, color: "emerald" },
    { titulo: "Categorias", valor: categorias.length, icono: Tags, color: "amber" },
    { titulo: "Tiempo prom.", valor: tiempoPromedio ? `${tiempoPromedio} min` : "-", icono: Clock, color: "rose" },
  ];

  const colores = {
    orange: "bg-orange-50 text-orange-500",
    emerald: "bg-emerald-50 text-emerald-500",
    amber: "bg-amber-50 text-amber-500",
    rose: "bg-rose-50 text-rose-500",
  };

  return (
    <div>
      <EncabezadoPagina
        titulo="Recetas de la comunidad"
        descripcion="Recetas internas de Cook Book con detalle, comentarios y valoraciones."
      />

      {/* Stats */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricas.map(({ titulo, valor, icono: Icono, color }) => (
          <article key={titulo} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-card">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${colores[color]}`}>
              <Icono size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{titulo}</p>
            <p className="mt-1 text-2xl font-black text-stone-900">{valor}</p>
          </article>
        ))}
      </div>

      {/* Búsqueda activa */}
      {busquedaGeneral && (
        <p className="mb-4 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
          Resultados para: <span className="font-bold">"{searchParams.get("buscar")}"</span>
        </p>
      )}

      <FiltrosRecetas filtros={filtros} categorias={categorias} onChange={(datos) => dispatch(actualizarFiltrosRecetas(datos))} />

      {cargando && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-orange-500" />
          Cargando recetas...
        </div>
      )}

      <MensajeError mensaje={error} />

      {!cargando && recetasFiltradas.length === 0 && (
        <EstadoVacio titulo="No hay recetas para mostrar" texto="Cuando la API devuelva recetas internas, van a aparecer en esta seccion." />
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {recetasFiltradas.map((receta) => {
          const recetaId = receta._id || receta.id;
          const recetaPropia = misRecetas.find((item) => (item._id || item.id) === recetaId);
          const usuarioReceta = completarUsuarioAutor({ receta, recetaPropia, usuarioActual: usuario, usuarios });
          return (
            <TarjetaReceta
              key={recetaId}
              receta={{ ...receta, usuario: usuarioReceta }}
              categoria={receta.categoriaId?.nombre ? receta.categoriaId : categorias.find((c) => c.id === idCategoriaReceta(receta) || c._id === idCategoriaReceta(receta))}
              usuarioActual={usuario}
              compacto
            />
          );
        })}
      </div>
    </div>
  );
}
