import { Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormularioReceta from "../components/recetas/FormularioReceta.jsx";
import TarjetaReceta from "../components/recetas/TarjetaReceta.jsx";
import Boton from "../components/Boton.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import Modal from "../components/Modal.jsx";
import api from "../api/api.js";
import { agregarReceta, actualizarReceta, quitarReceta } from "../features/recetasSlice.js";
import ConfirmacionEliminarReceta from "../components/recetas/ConfirmacionEliminarReceta.jsx";

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

const completarUsuarioReceta = (receta, usuarioActual) => {
  const usuarioDesdeReceta = typeof receta.usuario === "object" ? receta.usuario : {};
  const usuarioDesdeUsuarioId = typeof receta.usuarioId === "object" ? receta.usuarioId : {};

  return {
    ...usuarioActual,
    ...usuarioDesdeReceta,
    ...usuarioDesdeUsuarioId,
  };
};

export default function MisRecetas() {
  const dispatch = useDispatch();
  const misRecetas = useSelector((state) => state.recetas.misRecetas);
  const categorias = useSelector((state) => state.categorias.items);
  const usuario = useSelector((state) => state.auth.usuario);
  const [modal, setModal] = useState(null);
  const [recetaAEliminar, setRecetaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const esChef = usuario?.rol === "chef";
  const guardar = async (datos) => {
    if (!esChef && !modal?.receta) {
      toast.info("Tu rol lector no permite crear recetas");
      return;
    }

    try {
      if (modal?.receta) {
        const respuesta = await api.put(`/recetas/${modal.receta._id || modal.receta.id}`, crearFormDataReceta(datos));
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
  const confirmarEliminacion = async () => {
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
  return (
    <div>
      <EncabezadoPagina titulo="Mis recetas" descripcion={esChef ? "Listado de documentos del usuario con alta, edicion y eliminacion." : "Tu rol lector permite consultar recetas, pero no crear documentos propios."} accion={esChef && <Boton onClick={() => setModal({ tipo: "crear" })}><Plus size={18} /> Nueva receta</Boton>} />
      {!esChef && <p className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 font-semibold text-amber-700">Estas usando un perfil lector. Para crear recetas necesitarias ingresar con un usuario chef.</p>}
      {misRecetas.length === 0 && <EstadoVacio titulo="Todavia no tenes recetas" texto={esChef ? "Crea tu primer documento principal desde el boton Nueva receta." : "Cuando tengas recetas asociadas a tu usuario, van a aparecer en esta seccion."} />}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {misRecetas.map((receta) => <TarjetaReceta key={receta._id || receta.id} receta={{ ...receta, usuario: completarUsuarioReceta(receta, usuario) }} categoria={categorias.find((c) => c.id === receta.categoriaId || c._id === receta.categoriaId || c._id === receta.categoriaId?._id)} usuarioActual={usuario} editable onEditar={(item) => setModal({ tipo: "editar", receta: item })} onEliminar={(item) => setRecetaAEliminar(item)} />)}
      </div>
      <Modal abierto={Boolean(modal)} titulo={modal?.receta ? "Editar receta" : "Crear receta"} alCerrar={() => setModal(null)}>
        <FormularioReceta categorias={categorias} recetaInicial={modal?.receta} onSubmit={guardar} />
      </Modal>
      <Modal abierto={Boolean(recetaAEliminar)} titulo="Eliminar receta" alCerrar={() => setRecetaAEliminar(null)} tamano="compacto">
        <ConfirmacionEliminarReceta receta={recetaAEliminar} onCancelar={() => setRecetaAEliminar(null)} onConfirmar={confirmarEliminacion} cargando={eliminando} />
      </Modal>
    </div>
  );
}

