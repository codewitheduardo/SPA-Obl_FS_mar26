import { BookOpen, ChefHat, Clock, Tags } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import api from "../api/api.js";
import FiltrosRecetas from "../components/recetas/FiltrosRecetas.jsx";
import TarjetaReceta from "../components/recetas/TarjetaReceta.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import MensajeError from "../components/MensajeError.jsx";
import { actualizarFiltrosRecetas, guardarErrorRecetas, guardarRecetas, iniciarCargaRecetas } from "../features/recetasSlice.js";
import { completarAutorReceta, obtenerIdCategoriaReceta, obtenerIdReceta } from "../utils/recetas.js";

const textoIngredientes = (ingredientes) => (Array.isArray(ingredientes) ? ingredientes.join(" ") : String(ingredientes || ""));
const extraerRecetas = (respuesta) => {
  const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
  return cuerpoRespuesta?.results || cuerpoRespuesta || [];
};

export default function Recetas() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items, misRecetas, filtros, cargando, error } = useSelector((state) => state.recetas);
  const categorias = useSelector((state) => state.categorias.items);
  const usuario = useSelector((state) => state.auth.usuario);
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

  const recetasFiltradas = items.filter((receta) => {
    const categoriaId = obtenerIdCategoriaReceta(receta);
    const nombreCategoria = receta.categoriaId?.nombre || categorias.find((categoria) => categoria.id === categoriaId || categoria._id === categoriaId)?.nombre || "";

    return (
      (!busquedaGeneral ||
        receta.titulo.toLowerCase().includes(busquedaGeneral) ||
        textoIngredientes(receta.ingredientes).toLowerCase().includes(busquedaGeneral) ||
        nombreCategoria.toLowerCase().includes(busquedaGeneral)) &&
      receta.titulo.toLowerCase().includes(filtros.titulo.toLowerCase()) &&
      (!filtros.categoriaId || categoriaId === filtros.categoriaId) &&
      (!filtros.dificultad || receta.dificultad === filtros.dificultad) &&
      (!filtros.tiempoMaximo || Number(receta.tiempoPreparacion) <= Number(filtros.tiempoMaximo)) &&
      (!filtros.ingrediente || textoIngredientes(receta.ingredientes).toLowerCase().includes(filtros.ingrediente.toLowerCase()))
    );
  });

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
          const recetaId = obtenerIdReceta(receta);
          const categoriaId = obtenerIdCategoriaReceta(receta);
          const recetaPropia = misRecetas.find((item) => obtenerIdReceta(item) === recetaId);
          const usuarioReceta = completarAutorReceta(recetaPropia || receta, usuario);

          return (
            <TarjetaReceta
              key={recetaId}
              receta={{ ...receta, usuario: usuarioReceta }}
              categoria={receta.categoriaId?.nombre ? receta.categoriaId : categorias.find((c) => c.id === categoriaId || c._id === categoriaId)}
              usuarioActual={usuario}
              compacto
            />
          );
        })}
      </div>
    </div>
  );
}
