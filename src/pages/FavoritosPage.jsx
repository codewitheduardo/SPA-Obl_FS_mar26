import { AlertTriangle, Globe2, Heart, Search, Tags, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../api/api.js";
import TarjetaFavorito from "../components/favoritos/TarjetaFavorito.jsx";
import Boton from "../components/Boton.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EstadoVacio from "../components/EstadoVacio.jsx";
import Modal from "../components/Modal.jsx";
import { quitarFavoritoEstado } from "../features/favoritosSlice.js";

export default function Favoritos() {
  const dispatch = useDispatch();
  const favoritos = useSelector((state) => state.favoritos.items);
  const [busqueda, setBusqueda] = useState("");
  const [favoritoAEliminar, setFavoritoAEliminar] = useState(null);

  const favoritosFiltrados = favoritos.filter((favorito) => {
    const texto = `${favorito.nombre || ""} ${favorito.categoria || ""} ${favorito.area || ""}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const categorias = useMemo(() => new Set(favoritos.map((f) => f.categoria).filter(Boolean)).size, [favoritos]);
  const areas = useMemo(() => new Set(favoritos.map((f) => f.area).filter(Boolean)).size, [favoritos]);

  const confirmarEliminacion = async () => {
    if (!favoritoAEliminar) return;
    try {
      await api.delete(`/favoritos/${favoritoAEliminar.mealDbId}`);
      dispatch(quitarFavoritoEstado(favoritoAEliminar.mealDbId));
      toast.success("Favorito eliminado");
      setFavoritoAEliminar(null);
    } catch (error) {
      toast.error(error.message || "No se pudo eliminar favorito");
    }
  };

  return (
    <div>
      <EncabezadoPagina
        titulo="Favoritos"
        descripcion="Tus recetas externas guardadas desde TheMealDB para volver a encontrarlas rápido."
      />

      {/* Stats */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-orange-100 bg-orange-50 p-4 shadow-card">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-orange-500 shadow-card">
            <Heart size={18} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Guardadas</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{favoritos.length}</p>
          <p className="mt-0.5 text-xs text-orange-500">en tu biblioteca</p>
        </article>
        <article className="rounded-2xl border border-sky-100 bg-sky-50 p-4 shadow-card">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sky-500 shadow-card">
            <Globe2 size={18} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Cocinas</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{areas}</p>
          <p className="mt-0.5 text-xs text-sky-500">origenes distintos</p>
        </article>
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-card">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-card">
            <Tags size={18} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Categorias</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{categorias}</p>
          <p className="mt-0.5 text-xs text-emerald-500">tipos de recetas</p>
        </article>
      </div>

      {/* Buscador */}
      <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-bold text-stone-900">Biblioteca de favoritos</h3>
            <p className="mt-0.5 text-sm text-stone-500">Buscá por nombre, categoria o cocina de origen.</p>
          </div>
          <div className="flex w-full items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 lg:max-w-sm">
            <Search size={16} className="shrink-0 text-stone-400" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
              placeholder="Buscar favorito..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </section>

      {favoritos.length === 0 && (
        <EstadoVacio titulo="Sin favoritos" texto="Guardá recetas externas desde TheMealDB para verlas en esta biblioteca." />
      )}
      {favoritos.length > 0 && favoritosFiltrados.length === 0 && (
        <EstadoVacio titulo="Sin coincidencias" texto="No hay favoritos que coincidan con tu busqueda." />
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {favoritosFiltrados.map((favorito) => (
          <TarjetaFavorito key={favorito.mealDbId} favorito={favorito} onEliminar={setFavoritoAEliminar} />
        ))}
      </div>

      <Modal abierto={Boolean(favoritoAEliminar)} titulo="Quitar favorito" alCerrar={() => setFavoritoAEliminar(null)} tamano="compacto">
        <div className="p-2 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-black text-stone-900">Quitar de favoritos</h3>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Vas a quitar <span className="font-bold text-stone-800">{favoritoAEliminar?.nombre}</span> de tu biblioteca.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Boton variante="outline" type="button" onClick={() => setFavoritoAEliminar(null)}>Cancelar</Boton>
            <Boton variante="peligro" type="button" onClick={confirmarEliminacion}>
              <Trash2 size={15} /> Quitar
            </Boton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
