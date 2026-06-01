import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api.js";
import DetalleRecetaExternaContenido from "../components/recetasExternas/DetalleRecetaExternaContenido.jsx";
import EstadoVacio from "../components/ui/EstadoVacio.jsx";
import { extraerMeal } from "../utils/mealdb.js";

export default function DetalleRecetaExterna() {
  const { id } = useParams();
  const [receta, setReceta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDetalle = async () => {
      setCargando(true);
      try {
        const respuesta = await api.get(`/recetas-externas/${id}`);
        setReceta(extraerMeal(respuesta));
      } catch {
        setReceta(null);
      } finally {
        setCargando(false);
      }
    };
    cargarDetalle();
  }, [id]);

  if (cargando) return <p className="rounded-2xl bg-white p-4 font-bold text-stone-600">Cargando receta externa...</p>;
  if (!receta) return <EstadoVacio titulo="Receta externa no encontrada" texto="No existe una receta de TheMealDB con ese idMeal en la API." />;
  return <DetalleRecetaExternaContenido receta={receta} />;
}
