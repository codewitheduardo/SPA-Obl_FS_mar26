import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../api/api.js";
import { guardarCategorias, guardarErrorCategorias, iniciarCargaCategorias } from "../features/categoriasSlice.js";
import { guardarErrorFavoritos, guardarFavoritos, iniciarCargaFavoritos } from "../features/favoritosSlice.js";
import { guardarErrorRecetas, guardarMisRecetas, guardarRecetas, iniciarCargaRecetas } from "../features/recetasSlice.js";
import BarraLateral from "./BarraLateral.jsx";
import BarraSuperior from "./BarraSuperior.jsx";

const extraerListaDeRespuesta = (respuesta) => {
  const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
  return cuerpoRespuesta?.results || cuerpoRespuesta?.favoritos || cuerpoRespuesta?.categorias || cuerpoRespuesta || [];
};

export default function LayoutDashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        dispatch(iniciarCargaCategorias());
        const respuestaCategorias = await api.get("/categorias");
        dispatch(guardarCategorias(extraerListaDeRespuesta(respuestaCategorias)));
      } catch (error) {
        dispatch(guardarErrorCategorias(error.message));
      }

      try {
        dispatch(iniciarCargaRecetas());
        const respuestaRecetas = await api.get("/recetas");
        dispatch(guardarRecetas(extraerListaDeRespuesta(respuestaRecetas)));
        const respuestaMisRecetas = await api.get("/recetas/mis-recetas");
        dispatch(guardarMisRecetas(extraerListaDeRespuesta(respuestaMisRecetas)));
      } catch (error) {
        dispatch(guardarErrorRecetas(error.message));
      }

      try {
        dispatch(iniciarCargaFavoritos());
        const respuestaFavoritos = await api.get("/favoritos");
        dispatch(guardarFavoritos(extraerListaDeRespuesta(respuestaFavoritos)));
      } catch (error) {
        dispatch(guardarErrorFavoritos(error.message));
      }
    };

    cargarDatos();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-stone-50">
      <BarraLateral />
      <div className="min-w-0 px-4 pb-12 pt-20 sm:px-5 md:ml-64 md:px-6 md:pt-6 lg:px-8">
        <BarraSuperior />
        <Outlet />
      </div>
    </div>
  );
}
