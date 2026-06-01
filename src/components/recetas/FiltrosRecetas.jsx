import { Filter, RotateCcw } from "lucide-react";
import Boton from "../ui/Boton.jsx";
import CampoTexto from "../ui/CampoTexto.jsx";
import Selector from "../ui/Selector.jsx";

export default function FiltrosRecetas({ filtros, categorias, onChange }) {
  const limpiarFiltros = () => {
    onChange({
      titulo: "",
      categoriaId: "",
      dificultad: "",
      tiempoMaximo: "",
      ingrediente: "",
    });
  };

  return (
    <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-black text-stone-900"><Filter size={17} className="text-orange-600" /> Filtros de busqueda</p>
          <p className="mt-1 text-sm text-stone-500">Combiná titulo, categoria, dificultad, tiempo e ingredientes.</p>
        </div>
        <Boton variante="outline" type="button" className="w-full px-4 sm:w-auto" onClick={limpiarFiltros}>
          <RotateCcw size={16} />
          Limpiar
        </Boton>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <CampoTexto label="Titulo" value={filtros.titulo} onChange={(e) => onChange({ titulo: e.target.value })} />
        <Selector label="Categoria" value={filtros.categoriaId} onChange={(e) => onChange({ categoriaId: e.target.value })}>
          <option value="">Todas</option>
          {categorias.map((categoria) => <option key={categoria._id || categoria.id} value={categoria._id || categoria.id}>{categoria.nombre}</option>)}
        </Selector>
        <Selector label="Dificultad" value={filtros.dificultad} onChange={(e) => onChange({ dificultad: e.target.value })}>
          <option value="">Todas</option>
          <option value="facil">Facil</option>
          <option value="media">Media</option>
          <option value="dificil">Dificil</option>
        </Selector>
        <CampoTexto label="Tiempo maximo" type="number" min="1" value={filtros.tiempoMaximo} onChange={(e) => onChange({ tiempoMaximo: e.target.value })} />
        <CampoTexto label="Ingrediente" value={filtros.ingrediente} onChange={(e) => onChange({ ingrediente: e.target.value })} />
      </div>
    </section>
  );
}

