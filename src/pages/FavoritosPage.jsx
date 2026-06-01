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
  const categorias = useMemo(() => new Set(favoritos.map((favorito) => favorito.categoria).filter(Boolean)).size, [favoritos]);
  const areas = useMemo(() => new Set(favoritos.map((favorito) => favorito.area).filter(Boolean)).size, [favoritos]);

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
      <EncabezadoPagina titulo="Favoritos" descripcion="Tus recetas externas guardadas desde TheMealDB para volver a encontrarlas rapido." />

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-orange-100 bg-orange-50 p-4 shadow-sm">
          <Heart className="mb-3 text-orange-600" size={22} />
          <p className="text-sm font-semibold text-orange-700">Guardadas</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{favoritos.length}</p>
        </article>
        <article className="rounded-2xl border border-sky-100 bg-sky-50 p-4 shadow-sm">
          <Globe2 className="mb-3 text-sky-600" size={22} />
          <p className="text-sm font-semibold text-sky-700">Cocinas</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{areas}</p>
        </article>
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <Tags className="mb-3 text-emerald-600" size={22} />
          <p className="text-sm font-semibold text-emerald-700">Categorias</p>
          <p className="mt-1 text-2xl font-black text-stone-900">{categorias}</p>
        </article>
      </section>

      <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-black text-stone-900">Biblioteca de favoritos</h3>
            <p className="mt-1 text-sm text-stone-500">Busca por nombre, categoria o cocina.</p>
          </div>
          <label className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 lg:max-w-md">
            <Search size={18} className="text-stone-400" />
            <input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Buscar favorito" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
          </label>
        </div>
      </section>

      {favoritos.length === 0 && <EstadoVacio titulo="Sin favoritos" texto="Guarda recetas externas desde TheMealDB para verlas en esta biblioteca." />}
      {favoritos.length > 0 && favoritosFiltrados.length === 0 && <EstadoVacio titulo="Sin coincidencias" texto="No hay favoritos que coincidan con tu busqueda." />}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {favoritosFiltrados.map((favorito) => <TarjetaFavorito key={favorito.mealDbId} favorito={favorito} onEliminar={setFavoritoAEliminar} />)}
      </div>

      <Modal abierto={Boolean(favoritoAEliminar)} titulo="Quitar favorito" alCerrar={() => setFavoritoAEliminar(null)} tamano="compacto">
        <div className="rounded-2xl bg-white p-2 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
            <AlertTriangle size={24} />
          </div>
          <h3 className="mt-4 text-xl font-black text-stone-900">Quitar de favoritos</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">Vas a quitar <span className="font-black text-stone-900">{favoritoAEliminar?.nombre}</span> de tu biblioteca.</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Boton variante="outline" type="button" onClick={() => setFavoritoAEliminar(null)}>Cancelar</Boton>
            <Boton variante="peligro" type="button" onClick={confirmarEliminacion}><Trash2 size={18} /> Quitar</Boton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
