import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api.js";
import ComentariosReceta from "../components/recetas/ComentariosReceta.jsx";
import EncabezadoDetalleReceta from "../components/recetas/EncabezadoDetalleReceta.jsx";
import IngredientesReceta from "../components/recetas/IngredientesReceta.jsx";
import PasosReceta from "../components/recetas/PasosReceta.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import { guardarRecetaSeleccionada } from "../features/recetasSlice.js";

const idCategoriaReceta = (receta) => receta?.categoriaId?._id || receta?.categoriaId;

export default function DetalleReceta() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [cargando, setCargando] = useState(true);
  const recetaLocal = useSelector((state) => state.recetas.items.find((item) => item.id === id || item._id === id));
  const recetaSeleccionada = useSelector((state) => state.recetas.recetaSeleccionada);
  const receta = recetaLocal || recetaSeleccionada;
  const categorias = useSelector((state) => state.categorias.items);

  useEffect(() => {
    const cargarDetalle = async () => {
      setCargando(true);
      try {
        const respuesta = await api.get(`/recetas/${id}`);
        dispatch(guardarRecetaSeleccionada(respuesta.data.data));
      } catch {
        dispatch(guardarRecetaSeleccionada(null));
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [dispatch, id]);

  if (cargando && !receta) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-5 py-4 text-sm font-medium text-stone-600 shadow-card">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-200 border-t-orange-500" />
        Cargando receta...
      </div>
    );
  }

  if (!receta) {
    return <EstadoVacio titulo="Receta no encontrada" texto="No existe una receta interna con ese identificador." />;
  }

  return (
    <div>
      <EncabezadoDetalleReceta
        receta={receta}
        categoria={
          receta.categoriaId?.nombre
            ? receta.categoriaId
            : categorias.find((c) => c.id === idCategoriaReceta(receta) || c._id === idCategoriaReceta(receta))
        }
      />
      <div className="grid items-start gap-6 xl:grid-cols-[22rem_1fr]">
        <IngredientesReceta ingredientes={receta.ingredientes} />
        <PasosReceta pasos={receta.pasos} />
      </div>
      <ComentariosReceta recetaId={receta.id || receta._id} />
    </div>
  );
}
