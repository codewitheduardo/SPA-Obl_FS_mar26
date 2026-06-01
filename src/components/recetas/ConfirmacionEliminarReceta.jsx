import { AlertTriangle, Clock, Trash2, Users } from "lucide-react";
import Boton from "../Boton.jsx";

export default function ConfirmacionEliminarReceta({ receta, onCancelar, onConfirmar, cargando = false }) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
        <AlertTriangle size={28} />
      </div>
      <h3 className="mt-4 text-2xl font-black text-stone-900">Eliminar receta</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-600">Vas a eliminar <span className="font-black text-stone-900">{receta?.titulo}</span>. Esta accion no se puede deshacer.</p>

      <div className="mt-5 rounded-2xl border border-stone-100 bg-stone-50 p-4 text-left">
        <p className="line-clamp-2 font-black text-stone-900">{receta?.titulo}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-stone-500">
          <span className="flex items-center gap-1 rounded-xl bg-white px-2 py-2"><Clock size={14} className="text-orange-600" /> {receta?.tiempoPreparacion || "-"} min</span>
          <span className="flex items-center gap-1 rounded-xl bg-white px-2 py-2"><Users size={14} className="text-orange-600" /> {receta?.porciones || "-"} porc.</span>
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Boton variante="outline" type="button" onClick={onCancelar} disabled={cargando}>Cancelar</Boton>
        <Boton variante="peligro" type="button" onClick={onConfirmar} disabled={cargando}><Trash2 size={18} /> {cargando ? "Eliminando..." : "Eliminar"}</Boton>
      </div>
    </div>
  );
}
