import { Search, Shuffle } from "lucide-react";
import Boton from "../Boton.jsx";
import CampoTexto from "../CampoTexto.jsx";

export default function FiltrosRecetasExternas({ filtros, onChange, onBuscar, onAleatoria }) {
  return (
    <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">Buscador externo</p>
          <h2 className="text-xl font-black text-stone-900">Explorar TheMealDB</h2>
        </div>
        <Boton variante="outline" className="w-full sm:w-auto" onClick={onAleatoria}><Shuffle size={16} /> Recetas aleatorias</Boton>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_1.2fr_auto]">
        <CampoTexto label="Nombre de receta" value={filtros.q} onChange={(e) => onChange({ q: e.target.value, ingrediente: "" })} placeholder="Ej: Lasagne" />
        <CampoTexto label="Ingrediente" value={filtros.ingrediente} onChange={(e) => onChange({ ingrediente: e.target.value, q: "", categoriaExterna: "" })} placeholder="Ej: chicken" />
        <Boton className="w-full self-end xl:w-auto" onClick={onBuscar}><Search size={16} /> Buscar</Boton>
      </div>
    </div>
  );
}
