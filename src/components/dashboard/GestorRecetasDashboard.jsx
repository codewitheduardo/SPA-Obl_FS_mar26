import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/api.js";
import { actualizarReceta, agregarReceta, quitarReceta } from "../../features/recetasSlice.js";
import Boton from "../Boton.jsx";
import CampoTexto from "../CampoTexto.jsx";
import EstadoVacio from "../EstadoVacio.jsx";
import Modal from "../Modal.jsx";
import Selector from "../Selector.jsx";
import FormularioReceta from "../recetas/FormularioReceta.jsx";
import { crearFormDataReceta, esRecetaBorrador, prepararRecetaGuardada } from "../../utils/recetas.js";
import ConfirmacionEliminarReceta from "../recetas/ConfirmacionEliminarReceta.jsx";

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
        dispatch(actualizarReceta(prepararRecetaGuardada(respuesta, datos, modal.receta)));
        toast.success("Receta actualizada");
      } else {
        const respuesta = await api.post("/recetas", crearFormDataReceta(datos));
        dispatch(agregarReceta(prepararRecetaGuardada(respuesta, datos)));
        toast.success("Receta creada");
      }
      setModal(null);
    } catch (error) {
      toast.error(error.message || "No se pudo guardar la receta");
    }
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white shadow-card">
      <div className="flex flex-col justify-between gap-4 border-b border-stone-100 px-5 py-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Documento principal</p>
          <h3 className="mt-1 text-xl font-black text-stone-900">Gestion de mis recetas</h3>
          <p className="mt-0.5 text-sm text-stone-500">
            {esChef
              ? "Alta, filtros, edicion y eliminacion desde una unica interfaz."
              : "Consulta tus recetas y filtra resultados. El alta esta reservada para chefs."}
          </p>
        </div>
        {esChef ? (
          <Boton className="w-full sm:w-auto" onClick={() => setModal({ tipo: "crear" })}>
            <Plus size={16} /> Nueva receta
          </Boton>
        ) : (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
            Modo lector
          </span>
        )}
      </div>

      <div className="grid gap-3 bg-stone-50/60 px-5 py-4 sm:grid-cols-3">
        <CampoTexto
          label="Buscar por titulo"
          value={filtros.titulo}
          onChange={(e) => setFiltros((actuales) => ({ ...actuales, titulo: e.target.value }))}
          placeholder="Escribi un titulo..."
        />
        <Selector
          label="Categoria"
          value={filtros.categoriaId}
          onChange={(e) => setFiltros((actuales) => ({ ...actuales, categoriaId: e.target.value }))}
        >
          <option value="">Todas las categorias</option>
          {categorias.map((categoria) => (
            <option key={categoria._id || categoria.id} value={categoria._id || categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </Selector>
        <Selector
          label="Dificultad"
          value={filtros.dificultad}
          onChange={(e) => setFiltros((actuales) => ({ ...actuales, dificultad: e.target.value }))}
        >
          <option value="">Todas</option>
          <option value="facil">Facil</option>
          <option value="media">Media</option>
          <option value="dificil">Dificil</option>
        </Selector>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">Titulo</th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">Estado</th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">Categoria</th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">Dificultad</th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">Tiempo</th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {recetasFiltradas.map((receta) => {
              const categoriaId = receta.categoriaId?._id || receta.categoriaId;
              const categoria = categorias.find((item) => item.id === categoriaId || item._id === categoriaId);
              const borrador = esRecetaBorrador(receta);
              return (
                <tr key={receta._id || receta.id} className="transition-colors hover:bg-orange-50/30">
                  <td className="px-5 py-3.5 font-semibold text-stone-900">{receta.titulo}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${borrador ? "bg-stone-100 text-stone-600" : "bg-emerald-50 text-emerald-700"}`}>
                      {borrador ? "Borrador" : "Publicada"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-stone-500">
                    {receta.categoriaId?.nombre || categoria?.nombre || "Sin categoria"}
                  </td>
                  <td className="px-5 py-3.5 capitalize text-stone-500">{receta.dificultad}</td>
                  <td className="px-5 py-3.5 text-stone-500">{receta.tiempoPreparacion} min</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {esChef && (
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={() => setModal({ tipo: "editar", receta })}
                          title="Editar"
                        >
                          <Edit size={14} />
                        </button>
                      )}
                      <Link to={`/recetas/${receta._id || receta.id}`}>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                          title="Ver"
                        >
                          <Eye size={14} />
                        </button>
                      </Link>
                      {esChef && (
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100 hover:text-rose-700"
                          onClick={() => setRecetaAEliminar(receta)}
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {misRecetas.length === 0 && (
        <div className="p-5">
          <EstadoVacio
            titulo="Sin recetas propias"
            texto={esChef ? "Crea tu primera receta desde el boton Nueva receta." : "No hay recetas asociadas a tu usuario."}
          />
        </div>
      )}
      {misRecetas.length > 0 && recetasFiltradas.length === 0 && (
        <div className="p-5">
          <EstadoVacio titulo="Sin resultados" texto="No hay recetas que coincidan con los filtros." />
        </div>
      )}

      <Modal abierto={Boolean(modal)} titulo={modal?.receta ? "Editar receta" : "Nueva receta"} alCerrar={() => setModal(null)}>
        <FormularioReceta categorias={categorias} recetaInicial={modal?.receta} onSubmit={guardar} />
      </Modal>
      <Modal abierto={Boolean(recetaAEliminar)} titulo="Eliminar receta" alCerrar={() => setRecetaAEliminar(null)} tamano="compacto">
        <ConfirmacionEliminarReceta receta={recetaAEliminar} onCancelar={() => setRecetaAEliminar(null)} onConfirmar={eliminar} cargando={eliminando} />
      </Modal>
    </section>
  );
}
