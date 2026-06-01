import { AlertTriangle, BookOpen, Lock, Plus, Search, Tags, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormularioCategoria from "../components/categorias/FormularioCategoria.jsx";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria.jsx";
import Boton from "../components/Boton.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import Modal from "../components/Modal.jsx";
import api from "../api/api.js";
import { actualizarCategoria, agregarCategoria, quitarCategoria } from "../features/categoriasSlice.js";

const extraerCategoriaRespuesta = (respuesta) => {
  const cuerpoRespuesta = respuesta.data?.data || respuesta.data;
  return cuerpoRespuesta?.categoria || cuerpoRespuesta;
};

export default function Categorias() {
  const dispatch = useDispatch();
  const categorias = useSelector((state) => state.categorias.items);
  const usuario = useSelector((state) => state.auth.usuario);
  const [modal, setModal] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const esChef = usuario?.rol === "chef";
  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(busqueda.toLowerCase()),
  );
  const guardar = async (datos) => {
    try {
      if (modal?.categoria) {
        const respuesta = await api.put(`/categorias/${modal.categoria.id || modal.categoria._id}`, datos);
        dispatch(actualizarCategoria(extraerCategoriaRespuesta(respuesta)));
        toast.success("Categoria actualizada");
      } else {
        const respuesta = await api.post("/categorias", datos);
        dispatch(agregarCategoria(extraerCategoriaRespuesta(respuesta)));
        toast.success("Categoria creada");
      }
      setModal(null);
    } catch (error) {
      toast.error(error.message || "No se pudo guardar la categoria");
    }
  };
  const confirmarEliminacion = async () => {
    if (!categoriaAEliminar) return;

    try {
      const id = categoriaAEliminar.id || categoriaAEliminar._id;
      await api.delete(`/categorias/${id}`);
      dispatch(quitarCategoria(id));
      toast.success("Categoria eliminada");
      setCategoriaAEliminar(null);
    } catch (error) {
      toast.error(error.message || "No se pudo eliminar la categoria");
    }
  };
  return (
    <div>
      <EncabezadoPagina titulo="Categorias" descripcion="Organiza las recetas por tipo de comida. Los chefs pueden crear y mantener este catalogo." accion={esChef && <Boton onClick={() => setModal({ tipo: "crear" })}><Plus size={18} /> Nueva categoria</Boton>} />

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <Tags className="mb-3 text-orange-600" size={22} />
          <p className="text-sm font-semibold text-stone-500">Categorias</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{categorias.length}</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <BookOpen className="mb-3 text-emerald-600" size={22} />
          <p className="text-sm font-semibold text-stone-500">Coincidencias</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{categoriasFiltradas.length}</p>
          <p className="mt-1 text-xs font-semibold text-stone-400">segun tu busqueda</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <Lock className="mb-3 text-amber-600" size={22} />
          <p className="text-sm font-semibold text-stone-500">Permisos</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{esChef ? "Gestion habilitada" : "Modo consulta"}</p>
          <p className="mt-1 text-xs font-semibold text-stone-400">{esChef ? "crear, editar y eliminar" : "lectura del catalogo"}</p>
        </article>
      </section>

      <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-black text-stone-900">Gestion de categorias</h3>
            <p className="mt-1 text-sm text-stone-500">{esChef ? "Podes crear, editar y eliminar categorias." : "Las categorias son visibles para todos; tu rol no permite administrarlas."}</p>
          </div>
          <label className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 lg:max-w-sm">
            <Search size={18} className="text-stone-400" />
            <input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Buscar categoria" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
          </label>
        </div>
      </section>

      {!esChef && <p className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 font-semibold text-amber-700">Tu rol actual permite consultar categorias, pero no administrarlas.</p>}
      {categorias.length === 0 && <EstadoVacio titulo="Sin categorias" texto="Cuando la API devuelva categorias, se van a listar aca." />}
      {categorias.length > 0 && categoriasFiltradas.length === 0 && <EstadoVacio titulo="Sin resultados" texto="No hay categorias que coincidan con la busqueda." />}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categoriasFiltradas.map((categoria) => <TarjetaCategoria key={categoria._id || categoria.id} categoria={categoria} editable={esChef} onEditar={(categoriaSeleccionada) => setModal({ tipo: "editar", categoria: categoriaSeleccionada })} onEliminar={(categoriaSeleccionada) => setCategoriaAEliminar(categoriaSeleccionada)} />)}
      </div>
      <Modal abierto={Boolean(modal)} titulo={modal?.categoria ? "Editar categoria" : "Crear categoria"} alCerrar={() => setModal(null)}>
        <FormularioCategoria categoriaInicial={modal?.categoria} onSubmit={guardar} />
      </Modal>
      <Modal abierto={Boolean(categoriaAEliminar)} titulo="Eliminar categoria" alCerrar={() => setCategoriaAEliminar(null)} tamano="compacto">
        <div className="rounded-2xl bg-white p-2 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
            <AlertTriangle size={24} />
          </div>
          <h3 className="mt-4 text-xl font-black text-stone-900">Confirmar eliminacion</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">Estas por eliminar <span className="font-black text-stone-900">{categoriaAEliminar?.nombre}</span>. Esta accion no se puede deshacer.</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Boton variante="outline" type="button" onClick={() => setCategoriaAEliminar(null)}>Cancelar</Boton>
            <Boton variante="peligro" type="button" onClick={confirmarEliminacion}><Trash2 size={18} /> Eliminar</Boton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

