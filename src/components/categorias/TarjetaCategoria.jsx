import { Edit, Tag, Trash2 } from "lucide-react";

export default function TarjetaCategoria({ categoria, editable, onEditar, onEliminar }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-card-hover">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-transform group-hover:scale-105">
          <Tag size={20} />
        </div>
      </div>
      <h3 className="line-clamp-2 text-lg font-black text-stone-900 transition-colors group-hover:text-orange-700">
        {categoria.nombre}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-stone-500">
        {categoria.descripcion || "Categoria sin descripcion cargada."}
      </p>
      {editable && (
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-stone-100 pt-4">
          <button
            type="button"
            onClick={() => onEditar(categoria)}
            className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2 text-sm font-semibold text-stone-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Edit size={14} /> Editar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(categoria)}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      )}
    </article>
  );
}
