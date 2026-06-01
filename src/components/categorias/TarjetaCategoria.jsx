import { Edit, Tag, Trash2 } from "lucide-react";
import Boton from "../Boton.jsx";
import Tarjeta from "../Tarjeta.jsx";

export default function TarjetaCategoria({ categoria, editable, onEditar, onEliminar }) {
  return (
    <Tarjeta className="group flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-700 ring-1 ring-orange-100">
          <Tag size={22} />
        </span>
      </div>
      <h3 className="line-clamp-2 text-xl font-black text-stone-900 transition group-hover:text-orange-700">{categoria.nombre}</h3>
      <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-stone-600">{categoria.descripcion || "Categoria sin descripcion cargada."}</p>
      {editable && (
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-stone-100 pt-4">
          <Boton variante="outline" className="w-full px-3" onClick={() => onEditar(categoria)}><Edit size={16} /> Editar</Boton>
          <Boton variante="fantasma" className="w-full rounded-2xl border border-rose-100 px-3 text-rose-600 hover:bg-rose-50" onClick={() => onEliminar(categoria)}><Trash2 size={16} /> Eliminar</Boton>
        </div>
      )}
    </Tarjeta>
  );
}

