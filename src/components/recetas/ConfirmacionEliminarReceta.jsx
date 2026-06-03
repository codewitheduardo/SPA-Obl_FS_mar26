import { AlertTriangle, Clock, Trash2, Users } from "lucide-react";
import Boton from "../Boton.jsx";

export default function ConfirmacionEliminarReceta({ receta, onCancelar, onConfirmar, cargando = false }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
        <AlertTriangle size={26} />
      </div>
      <h3 className="mt-4 text-xl font-black text-stone-900">Eliminar receta</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
        Vas a eliminar <span className="font-bold text-stone-800">{receta?.titulo}</span>. Esta accion no se puede deshacer.
      </p>

      <div className="mt-5 rounded-xl border border-stone-100 bg-stone-50 p-4 text-left">
        <p className="line-clamp-2 font-bold text-stone-800">{receta?.titulo}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-stone-600 shadow-card">
            <Clock size={13} className="text-orange-500" />
            {receta?.tiempoPreparacion || "-"} min
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-stone-600 shadow-card">
            <Users size={13} className="text-orange-500" />
            {receta?.porciones || "-"} porc.
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Boton variante="outline" type="button" onClick={onCancelar} disabled={cargando}>Cancelar</Boton>
        <Boton variante="peligro" type="button" onClick={onConfirmar} disabled={cargando}>
          <Trash2 size={15} /> {cargando ? "Eliminando..." : "Eliminar"}
        </Boton>
      </div>
    </div>
  );
}
