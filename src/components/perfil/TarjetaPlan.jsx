import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/api.js";
import { actualizarUsuarioAutenticado } from "../../features/authSlice.js";
import Boton from "../Boton.jsx";
import Insignia from "../Insignia.jsx";
import Tarjeta from "../Tarjeta.jsx";

export default function TarjetaPlan({ plan }) {
  const dispatch = useDispatch();
  const [cargando, setCargando] = useState(false);
  const esPremium = plan === "premium";

  const cambiar = async () => {
    try {
      setCargando(true);
      const respuesta = await api.patch("/usuarios/plan", { plan: "premium" });
      dispatch(actualizarUsuarioAutenticado(respuesta.data.data?.usuario || respuesta.data.data));
      toast.success("Plan actualizado a premium");
    } catch (error) {
      toast.error(error.message || "No se pudo cambiar el plan");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Tarjeta className={`relative overflow-hidden ${esPremium ? "bg-gradient-to-br from-amber-50 to-lime-50" : "bg-white"}`}>
      <div className="absolute right-4 top-4 text-amber-200"><Crown size={54} /></div>
      <div className="relative">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Plan de uso</p>
        <h3 className="mt-1 text-2xl font-black text-stone-900">Plan actual</h3>
        <Insignia className="mt-3 bg-amber-100 text-amber-700">{plan}</Insignia>

        <div className="mt-5 space-y-3">
          <p className="flex items-start gap-2 text-sm font-semibold text-stone-600"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" /> Gestion de recetas y favoritos desde Cook Book.</p>
          <p className="flex items-start gap-2 text-sm font-semibold text-stone-600"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" /> Exploracion de recetas externas TheMealDB.</p>
          <p className="flex items-start gap-2 text-sm font-semibold text-stone-600"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" /> Herramientas de IA segun permisos del usuario.</p>
        </div>

        {esPremium ? (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-white/80 p-4">
            <p className="flex items-center gap-2 font-black text-emerald-700"><Sparkles size={18} /> Premium activo</p>
            <p className="mt-1 text-sm text-stone-600">Tu cuenta ya tiene el plan mas alto disponible.</p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="font-black text-stone-900">Upgrade disponible</p>
            <p className="mt-1 text-sm text-stone-600">Pasa a premium para ampliar el uso del recetario.</p>
            <Boton className="mt-4 w-full" onClick={cambiar} disabled={cargando}><Crown size={18} /> {cargando ? "Actualizando..." : "Cambiar a premium"}</Boton>
          </div>
        )}
      </div>
    </Tarjeta>
  );
}
