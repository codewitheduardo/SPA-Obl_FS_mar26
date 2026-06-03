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
      <EncabezadoPagina
        titulo="Categorias"
        descripcion="Organizá las recetas por tipo de comida. Los chefs pueden crear y mantener este catálogo."
        accion={esChef && (
          <Boton onClick={() => setModal({ tipo: "crear" })}>
            <Plus size={16} /> Nueva categoria
          </Boton>
        )}
      />

      {/* Stats */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-card">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <Tags size={18} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Total</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{categorias.length}</p>
          <p className="mt-0.5 text-xs text-stone-400">categorias cargadas</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-card">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
            <BookOpen size={18} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Filtradas</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{categoriasFiltradas.length}</p>
          <p className="mt-0.5 text-xs text-stone-400">segun tu busqueda</p>
        </article>
        <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-card">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <Lock size={18} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Permisos</p>
          <p className="mt-1 text-lg font-black text-stone-900">{esChef ? "Gestion" : "Consulta"}</p>
          <p className="mt-0.5 text-xs text-stone-400">{esChef ? "crear, editar y eliminar" : "lectura del catalogo"}</p>
        </article>
      </div>

      {/* Buscador */}
      <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-bold text-stone-900">Catálogo de categorias</h3>
            <p className="mt-0.5 text-sm text-stone-500">
              {esChef ? "Podés crear, editar y eliminar categorias." : "Las categorias son visibles para todos; tu rol no permite administrarlas."}
            </p>
          </div>
          <div className="flex w-full items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 lg:max-w-sm">
            <Search size={16} className="shrink-0 text-stone-400" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
              placeholder="Buscar categoria..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>
        </div>
      </section>

      {!esChef && (
        <p className="mb-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Tu rol actual permite consultar categorias, pero no administrarlas.
        </p>
      )}

      {categorias.length === 0 && (
        <EstadoVacio titulo="Sin categorias" texto="Cuando la API devuelva categorias, se van a listar aca." />
      )}
      {categorias.length > 0 && categoriasFiltradas.length === 0 && (
        <EstadoVacio titulo="Sin resultados" texto="No hay categorias que coincidan con la busqueda." />
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categoriasFiltradas.map((categoria) => (
          <TarjetaCategoria
            key={categoria._id || categoria.id}
            categoria={categoria}
            editable={esChef}
            onEditar={(cat) => setModal({ tipo: "editar", categoria: cat })}
            onEliminar={(cat) => setCategoriaAEliminar(cat)}
          />
        ))}
      </div>

      <Modal abierto={Boolean(modal)} titulo={modal?.categoria ? "Editar categoria" : "Nueva categoria"} alCerrar={() => setModal(null)}>
        <FormularioCategoria categoriaInicial={modal?.categoria} onSubmit={guardar} />
      </Modal>

      <Modal abierto={Boolean(categoriaAEliminar)} titulo="Eliminar categoria" alCerrar={() => setCategoriaAEliminar(null)} tamano="compacto">
        <div className="p-2 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-black text-stone-900">Confirmar eliminacion</h3>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Vas a eliminar <span className="font-bold text-stone-800">{categoriaAEliminar?.nombre}</span>. Esta accion no se puede deshacer.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Boton variante="outline" type="button" onClick={() => setCategoriaAEliminar(null)}>Cancelar</Boton>
            <Boton variante="peligro" type="button" onClick={confirmarEliminacion}>
              <Trash2 size={15} /> Eliminar
            </Boton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
