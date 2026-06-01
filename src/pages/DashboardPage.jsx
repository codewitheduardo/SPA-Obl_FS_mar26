import { BookOpen, Heart, MessageCircle, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/api.js";
import CambioPlan from "../components/dashboard/CambioPlan.jsx";
import GestorRecetasDashboard from "../components/dashboard/GestorRecetasDashboard.jsx";
import GraficoDashboard from "../components/dashboard/GraficoDashboard.jsx";
import TarjetaMetrica from "../components/dashboard/TarjetaMetrica.jsx";
import UltimasRecetas from "../components/dashboard/UltimasRecetas.jsx";
import UltimosComentarios from "../components/dashboard/UltimosComentarios.jsx";
import UsoPlan from "../components/dashboard/UsoPlan.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";

const extraerComentariosDeRespuesta = (respuesta) => {
  const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
  return cuerpoRespuesta?.results || cuerpoRespuesta?.comentarios || cuerpoRespuesta || [];
};

const obtenerIdCategoria = (receta) => String(receta.categoriaId?._id || receta.categoriaId || "");
const obtenerIdCategoriaCatalogo = (categoria) => String(categoria?._id || categoria?.id || "");

const crearActividadUltimosDias = (recetas) => {
  const hoy = new Date();
  const ultimosSieteDias = Array.from({ length: 7 }, (_, indice) => {
    const fechaDelDia = new Date(hoy);
    fechaDelDia.setDate(hoy.getDate() - (6 - indice));
    fechaDelDia.setHours(0, 0, 0, 0);

    return {
      fecha: fechaDelDia,
      nombre: fechaDelDia.toLocaleDateString("es-UY", { weekday: "short" }).replace(".", ""),
      valor: 0,
    };
  });

  recetas.forEach((receta) => {
    const fecha = receta.createdAt || receta.updatedAt;
    if (!fecha) return;
    const fechaReceta = new Date(fecha);
    fechaReceta.setHours(0, 0, 0, 0);
    const diaEncontrado = ultimosSieteDias.find((dia) => dia.fecha.getTime() === fechaReceta.getTime());
    if (diaEncontrado) diaEncontrado.valor += 1;
  });

  return ultimosSieteDias.map(({ nombre, valor }) => ({ nombre, valor }));
};

const agruparRecetasPorCategoria = (categorias, recetas) => {
  const recetasAgrupadas = categorias
    .map((categoria) => ({
      nombre: categoria.nombre,
      valor: recetas.filter((receta) => obtenerIdCategoria(receta) === obtenerIdCategoriaCatalogo(categoria)).length,
    }))
    .filter((categoriaAgrupada) => categoriaAgrupada.valor > 0)
    .sort((primeraCategoria, segundaCategoria) => segundaCategoria.valor - primeraCategoria.valor);

  const categoriasPrincipales = recetasAgrupadas.slice(0, 6);
  const cantidadOtrasCategorias = recetasAgrupadas.slice(6).reduce((total, categoria) => total + categoria.valor, 0);

  return cantidadOtrasCategorias > 0 ? [...categoriasPrincipales, { nombre: "Otras", valor: cantidadOtrasCategorias }] : categoriasPrincipales;
};

export default function Dashboard() {
  const recetas = useSelector((state) => state.recetas.items);
  const misRecetas = useSelector((state) => state.recetas.misRecetas);
  const categorias = useSelector((state) => state.categorias.items);
  const favoritos = useSelector((state) => state.favoritos.items);
  const usuario = useSelector((state) => state.auth.usuario);
  const [comentarios, setComentarios] = useState([]);
  const plan = usuario?.plan || "plus";
  const totalComentarios = comentarios.length;
  const recetasDelUsuario = misRecetas;
  const recetasPorCategoria = agruparRecetasPorCategoria(categorias, recetasDelUsuario);
  const actividadUltimosDias = crearActividadUltimosDias(recetasDelUsuario);
  const valorMaximoMetrica = Math.max(recetasDelUsuario.length, categorias.length, favoritos.length, totalComentarios, 1);
  const calcularProgresoMetrica = (valor) => Math.round((Number(valor || 0) / valorMaximoMetrica) * 100);

  useEffect(() => {
    const cargarComentarios = async () => {
      const recetasConComentarios = recetas.filter((receta) => receta._id || receta.id);
      const respuestasComentarios = await Promise.allSettled(recetasConComentarios.map((receta) => api.get(`/recetas/${receta._id || receta.id}/comentarios`)));
      const comentariosConReceta = respuestasComentarios.flatMap((respuestaComentario, indice) => {
        if (respuestaComentario.status !== "fulfilled") return [];

        const receta = recetasConComentarios[indice];
        return extraerComentariosDeRespuesta(respuestaComentario.value).map((comentario) => ({
          ...comentario,
          recetaOrigen: {
            id: receta._id || receta.id,
            titulo: receta.titulo,
          },
        }));
      });
      setComentarios(comentariosConReceta);
    };

    if (recetas.length) cargarComentarios();
    else setComentarios([]);
  }, [recetas]);

  return (
    <div>
      <EncabezadoPagina titulo="Dashboard de gestion general" descripcion="Alta de recetas, mis recetas, filtros, informe de uso del plan, cambio de plan, graficos y actividad del recetario." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaMetrica titulo="Mis recetas" valor={recetasDelUsuario.length} detalle="Documento principal del obligatorio" progreso={calcularProgresoMetrica(recetasDelUsuario.length)} icono={BookOpen} />
        <TarjetaMetrica titulo="Categorias cargadas" valor={categorias.length} detalle="Para organizar recetas" progreso={calcularProgresoMetrica(categorias.length)} icono={Tags} tono="emerald" />
        <TarjetaMetrica titulo="Favoritos externos" valor={favoritos.length} detalle="Guardados de TheMealDB" progreso={calcularProgresoMetrica(favoritos.length)} icono={Heart} tono="amber" />
        <TarjetaMetrica titulo="Comentarios recibidos" valor={totalComentarios} detalle="En recetas visibles" progreso={calcularProgresoMetrica(totalComentarios)} icono={MessageCircle} tono="rose" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:gap-6">
        <UsoPlan plan={plan} usadas={misRecetas.length} limite={4} total={recetas.length} />
        <CambioPlan />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:gap-6">
        <GraficoDashboard titulo="Recetas por categoria" datos={recetasPorCategoria} tipo="doughnut" />
        <GraficoDashboard titulo="Recetas creadas en los ultimos 7 dias" datos={actividadUltimosDias} tipo="line" />
      </div>
      <div className="mt-6"><GestorRecetasDashboard misRecetas={misRecetas} categorias={categorias} /></div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:gap-6"><UltimasRecetas recetas={recetas} /><UltimosComentarios comentarios={comentarios} /></div>
    </div>
  );
}


