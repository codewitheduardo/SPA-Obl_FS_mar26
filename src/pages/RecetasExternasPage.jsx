import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../api/api.js";
import FiltrosRecetasExternas from "../components/recetasExternas/FiltrosRecetasExternas.jsx";
import TarjetaRecetaExterna from "../components/recetasExternas/TarjetaRecetaExterna.jsx";
import EncabezadoPagina from "../components/ui/EncabezadoPagina.jsx";
import EstadoVacio from "../components/ui/EstadoVacio.jsx";
import { agregarFavoritoEstado } from "../features/favoritos/favoritosSlice.js";
import { esFavoritoMealDB, extraerCategoriasMealDB, extraerFavoritoMealDB, extraerMeal, extraerMeals, filtrarMealsPorCategoria, obtenerCategoriasDesdeMeals } from "../utils/mealdb.js";

export default function RecetasExternas() {
  const dispatch = useDispatch();
  const [recetasExternas, setRecetasExternas] = useState([]);
  const [filtros, setFiltros] = useState({ q: "", ingrediente: "", categoriaExterna: "" });
  const [categoriasExternas, setCategoriasExternas] = useState([]);
  const [favoritosVerificados, setFavoritosVerificados] = useState({});
  const [cargando, setCargando] = useState(false);
  const favoritos = useSelector((state) => state.favoritos.items);
  const categoriasEnResultados = obtenerCategoriasDesdeMeals(recetasExternas);
  const recetasVisibles = filtrarMealsPorCategoria(recetasExternas, filtros.categoriaExterna);

  useEffect(() => {
    const cargarCategoriasExternas = async () => {
      try {
        const respuesta = await api.get("/recetas-externas/categorias");
        setCategoriasExternas(extraerCategoriasMealDB(respuesta));
      } catch (error) {
        toast.error(error.message || "No se pudieron cargar categorias externas");
      }
    };

    cargarCategoriasExternas();
  }, []);

  useEffect(() => {
    const verificarFavoritos = async () => {
      const respuestasFavoritos = await Promise.allSettled(recetasExternas.map((receta) => api.get(`/favoritos/${receta.idMeal}`)));
      const favoritosPorMealId = {};

      respuestasFavoritos.forEach((respuestaFavorito, indice) => {
        const receta = recetasExternas[indice];
        favoritosPorMealId[receta.idMeal] = respuestaFavorito.status === "fulfilled" && esFavoritoMealDB(respuestaFavorito.value);
      });

      setFavoritosVerificados(favoritosPorMealId);
    };

    if (recetasExternas.length) verificarFavoritos();
    else setFavoritosVerificados({});
  }, [recetasExternas]);

  const agregarRecetaExternaAFavoritos = async (receta) => {
    let yaExiste = favoritos.some((fav) => fav.mealDbId === receta.idMeal) || favoritosVerificados[receta.idMeal];
    try {
      const verificacion = await api.get(`/favoritos/${receta.idMeal}`);
      yaExiste = esFavoritoMealDB(verificacion);
    } catch {
      yaExiste = favoritos.some((fav) => fav.mealDbId === receta.idMeal) || favoritosVerificados[receta.idMeal];
    }

    if (yaExiste) return toast.info("La receta ya estaba en favoritos");

    try {
      const respuestaFavorito = await api.post(`/favoritos/${receta.idMeal}`);
      dispatch(agregarFavoritoEstado(extraerFavoritoMealDB(respuestaFavorito, receta)));
      setFavoritosVerificados((actuales) => ({ ...actuales, [receta.idMeal]: true }));
      toast.success("Favorito agregado");
    } catch (error) {
      toast.error(error.message || "No se pudo agregar favorito");
    }
  };
  const cargarRecetasAleatorias = async () => {
    const respuestasAleatorias = await Promise.allSettled(
      Array.from({ length: 8 }, () => api.get("/recetas-externas/aleatoria")),
    );
    const recetasAleatorias = respuestasAleatorias
      .filter((respuestaAleatoria) => respuestaAleatoria.status === "fulfilled")
      .map((respuestaAleatoria) => extraerMeal(respuestaAleatoria.value))
      .filter(Boolean);

    return Array.from(new Map(recetasAleatorias.map((receta) => [receta.idMeal, receta])).values());
  };
  const enriquecerRecetasConDetalle = async (recetas) => {
    const recetasUnicas = Array.from(new Map(recetas.map((receta) => [receta.idMeal, receta])).values());
    const respuestasDetalles = await Promise.allSettled(
      recetasUnicas.map((receta) => api.get(`/recetas-externas/${receta.idMeal}`)),
    );

    return recetasUnicas.map((receta, indice) => {
      const respuestaDetalle = respuestasDetalles[indice];
      if (respuestaDetalle.status !== "fulfilled") return receta;
      return { ...receta, ...extraerMeal(respuestaDetalle.value) };
    });
  };
  const buscarConFiltros = async (filtrosBusqueda) => {
    setCargando(true);
    try {
      const ingrediente = filtrosBusqueda.ingrediente.trim();
      const nombre = filtrosBusqueda.q.trim();
      setFiltros((actuales) => ({ ...actuales, categoriaExterna: "" }));

      if (!ingrediente && !nombre) {
        setRecetasExternas(await cargarRecetasAleatorias());
        return;
      }

      const respuestaBusqueda = ingrediente
        ? await api.get("/recetas-externas/ingrediente", { params: { ingrediente } })
        : await api.get("/recetas-externas/buscar", { params: { q: nombre } });
      setRecetasExternas(await enriquecerRecetasConDetalle(extraerMeals(respuestaBusqueda)));
    } catch (error) {
      toast.error(error.message || "No se pudo buscar recetas externas");
    } finally {
      setCargando(false);
    }
  };
  const buscarRecetasExternas = () => buscarConFiltros(filtros);
  const cargarRecetasAleatoriasEnPantalla = async () => {
    setCargando(true);
    try {
      setRecetasExternas(await cargarRecetasAleatorias());
      toast.success("Recetas aleatorias cargadas");
    } catch (error) {
      toast.error(error.message || "No se pudieron obtener recetas aleatorias");
    } finally {
      setCargando(false);
    }
  };
  return (
    <div>
      <EncabezadoPagina titulo="Recetas externas TheMealDB" descripcion="Explora recetas internacionales, busca por nombre o ingrediente y guarda tus favoritas." />
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-stone-400">Resultados</p>
          <p className="mt-2 text-3xl font-black text-stone-900">{recetasVisibles.length}</p>
          <p className="mt-1 text-sm text-stone-500">recetas encontradas</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">Origen</p>
          <p className="mt-2 text-2xl font-black text-stone-900">Internacional</p>
          <p className="mt-1 text-sm text-stone-600">recetas importadas de TheMealDB</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Categorias</p>
          <p className="mt-2 text-3xl font-black text-stone-900">{categoriasEnResultados.length || categoriasExternas.length}</p>
          <p className="mt-1 text-sm text-stone-600">{recetasExternas.length ? "en los resultados" : "disponibles para explorar"}</p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-orange-700">Favoritos</p>
          <p className="mt-2 text-3xl font-black text-stone-900">{favoritos.length}</p>
          <p className="mt-1 text-sm text-stone-600">externos guardados</p>
        </div>
      </div>
      <FiltrosRecetasExternas filtros={filtros} onChange={(datos) => setFiltros((actuales) => ({ ...actuales, ...datos }))} onBuscar={buscarRecetasExternas} onAleatoria={cargarRecetasAleatoriasEnPantalla} />
      {categoriasExternas.length > 0 && (
        <div className="mb-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-sky-700">Explorar por categoria</p>
              <p className="text-sm font-semibold text-stone-600">
                {recetasExternas.length ? "Filtra las recetas que ya cargaste usando las categorias reales de cada resultado." : "Busca recetas por nombre, ingrediente o aleatorias. Cuando haya resultados, estas categorias sirven para ordenarlos."}
              </p>
            </div>
            {filtros.categoriaExterna && (
              <button type="button" onClick={() => setFiltros((actuales) => ({ ...actuales, categoriaExterna: "" }))} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-600 transition hover:bg-orange-50 hover:text-orange-700">
                Ver todas
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(recetasExternas.length ? categoriasEnResultados : categoriasExternas).map((nombre) => {
              const activa = filtros.categoriaExterna === nombre;
              return (
                <button
                  key={nombre}
                  type="button"
                  disabled={!recetasExternas.length}
                  onClick={() => setFiltros((actuales) => ({ ...actuales, categoriaExterna: activa ? "" : nombre }))}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                    activa
                      ? "bg-sky-700 text-white"
                    : recetasExternas.length
                        ? "bg-sky-50 text-sky-700 hover:bg-sky-100"
                        : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {nombre}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {cargando && <p className="mb-4 rounded-2xl bg-white p-4 font-bold text-stone-600">Buscando recetas externas...</p>}
      {!cargando && recetasVisibles.length === 0 && <EstadoVacio titulo="Busca una receta externa" texto="Usa el buscador por nombre, ingrediente o carga una receta aleatoria desde TheMealDB." />}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {recetasVisibles.map((receta) => <TarjetaRecetaExterna key={receta.idMeal} receta={receta} esFavorita={favoritos.some((favorito) => favorito.mealDbId === receta.idMeal) || favoritosVerificados[receta.idMeal]} onFavorito={agregarRecetaExternaAFavoritos} />)}
      </div>
    </div>
  );
}

