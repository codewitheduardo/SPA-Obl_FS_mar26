import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/api.js";
import { actualizarReceta, agregarReceta, quitarReceta } from "../../features/recetas/recetasSlice.js";
import Boton from "../ui/Boton.jsx";
import CampoTexto from "../ui/CampoTexto.jsx";
import EstadoVacio from "../ui/EstadoVacio.jsx";
import Modal from "../ui/Modal.jsx";
import Selector from "../ui/Selector.jsx";
import FormularioReceta from "../recetas/FormularioReceta.jsx";
import { esRecetaBorrador } from "../../utils/recetas.js";
import ConfirmacionEliminarReceta from "../recetas/ConfirmacionEliminarReceta.jsx";

const crearFormDataReceta = (datos) => {
  const formData = new FormData();
  const ingredientesReceta = Array.isArray(datos.ingredientes) ? datos.ingredientes : String(datos.ingredientes || "").split(",").map((ingrediente) => ingrediente.trim()).filter(Boolean);
  const pasosReceta = Array.isArray(datos.pasos) ? datos.pasos : String(datos.pasos || "").split(".").map((paso) => paso.trim()).filter(Boolean);

  formData.append("titulo", datos.titulo);
  formData.append("descripcion", datos.descripcion);
  ingredientesReceta.forEach((ingrediente) => formData.append("ingredientes", ingrediente));
  pasosReceta.forEach((paso) => formData.append("pasos", paso));
  formData.append("tiempoPreparacion", Number(datos.tiempoPreparacion));
  formData.append("porciones", Number(datos.porciones));
  formData.append("dificultad", datos.dificultad);
  formData.append("categoriaId", datos.categoriaId);
  formData.append("estado", datos.estado || "publicada");
  if (datos.imagen instanceof File) formData.append("imagen", datos.imagen);

  return formData;
};

const extraerRecetaRespuesta = (respuesta) => {
  const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
  return cuerpoRespuesta?.receta || cuerpoRespuesta;
};

const normalizarRecetaGuardada = (respuesta, datos, recetaAnterior = {}) => ({
  ...recetaAnterior,
  ...extraerRecetaRespuesta(respuesta),
  estado: datos.estado,
});

export default function GestorRecetasDashboard({ misRecetas, categorias }) {
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.auth.usuario);
  const [modal, setModal] = useState(null);
  const [recetaAEliminar, setRecetaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [filtros, setFiltros] = useState({ titulo: "", categoriaId: "", dificultad: "" });
  const esChef = usuario?.rol === "chef";

  const recetasFiltradas = misRecetas.filter((receta) => {
    const categoriaId = receta.categoriaId?._id || receta.categoriaId;
    return (
      receta.titulo.toLowerCase().includes(filtros.titulo.toLowerCase()) &&
      (!filtros.categoriaId || categoriaId === filtros.categoriaId) &&
      (!filtros.dificultad || receta.dificultad === filtros.dificultad)
    );
  });

  const eliminar = async () => {
    if (!recetaAEliminar) return;

    try {
      setEliminando(true);
      const id = recetaAEliminar._id || recetaAEliminar.id;
      await api.delete(`/recetas/${id}`);
      dispatch(quitarReceta(id));
      toast.success("Receta eliminada");
      setRecetaAEliminar(null);
    } catch (error) {
      toast.error(error.message || "No se pudo eliminar la receta");
    } finally {
      setEliminando(false);
    }
  };

  const guardar = async (datos) => {
    if (!esChef && !modal?.receta) {
      toast.info("Tu rol lector no permite crear recetas");
      return;
    }

    try {
      if (modal?.receta) {
        const id = modal.receta._id || modal.receta.id;
        const respuesta = await api.put(`/recetas/${id}`, crearFormDataReceta(datos));
        dispatch(actualizarReceta(normalizarRecetaGuardada(respuesta, datos, modal.receta)));
        toast.success("Receta actualizada");
      } else {
        const respuesta = await api.post("/recetas", crearFormDataReceta(datos));
        dispatch(agregarReceta(normalizarRecetaGuardada(respuesta, datos)));
        toast.success("Receta creada");
      }
      setModal(null);
    } catch (error) {
      toast.error(error.message || "No se pudo guardar la receta");
    }
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
      <div className="mb-5 flex flex-col justify-between gap-3 border-b border-stone-100 pb-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-orange-600">Documento principal</p>
          <h3 className="mt-1 text-xl font-black text-stone-900">Gestion rapida de mis recetas</h3>
          <p className="mt-1 text-sm text-stone-500">{esChef ? "Alta, filtros, edicion y eliminacion desde una unica interfaz." : "Consulta tus recetas y filtra resultados. El alta esta reservada para usuarios chef."}</p>
        </div>
        {esChef ? (
          <Boton className="w-full sm:w-auto" onClick={() => setModal({ tipo: "crear" })}><Plus size={18} /> Alta receta</Boton>
        ) : (
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700 ring-1 ring-amber-100">Modo lector</span>
        )}
      </div>
      <div className="mb-4 grid gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-3 lg:grid-cols-3">
        <CampoTexto label="Filtrar por titulo" value={filtros.titulo} onChange={(e) => setFiltros((actuales) => ({ ...actuales, titulo: e.target.value }))} />
        <Selector label="Filtrar por categoria" value={filtros.categoriaId} onChange={(e) => setFiltros((actuales) => ({ ...actuales, categoriaId: e.target.value }))}>
          <option value="">Todas</option>
          {categorias.map((categoria) => <option key={categoria._id || categoria.id} value={categoria._id || categoria.id}>{categoria.nombre}</option>)}
        </Selector>
        <Selector label="Filtrar por dificultad" value={filtros.dificultad} onChange={(e) => setFiltros((actuales) => ({ ...actuales, dificultad: e.target.value }))}>
          <option value="">Todas</option>
          <option value="facil">Facil</option>
          <option value="media">Media</option>
          <option value="dificil">Dificil</option>
        </Selector>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-stone-100">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-stone-50 text-xs font-black uppercase tracking-wide text-stone-500"><tr><th className="px-4 py-3">Titulo</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Categoria</th><th className="px-4 py-3">Dificultad</th><th className="px-4 py-3">Tiempo</th><th className="px-4 py-3">Acciones</th></tr></thead>
          <tbody>
            {recetasFiltradas.map((receta) => {
              const categoriaId = receta.categoriaId?._id || receta.categoriaId;
              const categoria = categorias.find((item) => item.id === categoriaId || item._id === categoriaId);
              return (
                <tr key={receta._id || receta.id} className="border-t border-stone-100 transition hover:bg-orange-50/40">
                  <td className="px-4 py-3 font-bold text-stone-900">{receta.titulo}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-black ${esRecetaBorrador(receta) ? "bg-stone-100 text-stone-700" : "bg-emerald-50 text-emerald-700"}`}>{esRecetaBorrador(receta) ? "Borrador" : "Publicada"}</span></td>
                  <td className="px-4 py-3 text-stone-600">{receta.categoriaId?.nombre || categoria?.nombre || "Sin categoria"}</td>
                  <td className="px-4 py-3 capitalize text-stone-600">{receta.dificultad}</td>
                  <td className="px-4 py-3 text-stone-600">{receta.tiempoPreparacion} min</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {esChef && <Boton variante="secundario" className="px-3 py-2" onClick={() => setModal({ tipo: "editar", receta })}><Edit size={14} /> Editar</Boton>}
                      <Link to={`/recetas/${receta._id || receta.id}`}><Boton variante="outline" className="px-3 py-2"><Eye size={14} /> Ver</Boton></Link>
                      {esChef && <Boton variante="peligro" className="px-3 py-2" onClick={() => setRecetaAEliminar(receta)}><Trash2 size={14} /> Eliminar</Boton>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {misRecetas.length === 0 && <div className="mt-4"><EstadoVacio titulo="Sin recetas propias" texto={esChef ? "Crea una receta desde Alta receta para que aparezca en este dashboard." : "No hay recetas asociadas a tu usuario para mostrar."} /></div>}
      {misRecetas.length > 0 && recetasFiltradas.length === 0 && <div className="mt-4"><EstadoVacio titulo="Sin resultados" texto="No hay recetas propias que coincidan con los filtros elegidos." /></div>}
      <Modal abierto={Boolean(modal)} titulo={modal?.receta ? "Editar receta" : "Alta de receta"} alCerrar={() => setModal(null)}>
        <FormularioReceta categorias={categorias} recetaInicial={modal?.receta} onSubmit={guardar} />
      </Modal>
      <Modal abierto={Boolean(recetaAEliminar)} titulo="Eliminar receta" alCerrar={() => setRecetaAEliminar(null)} tamano="compacto">
        <ConfirmacionEliminarReceta receta={recetaAEliminar} onCancelar={() => setRecetaAEliminar(null)} onConfirmar={eliminar} cargando={eliminando} />
      </Modal>
    </section>
  );
}


