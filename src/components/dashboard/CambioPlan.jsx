import { Crown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/api.js";
import { actualizarUsuarioAutenticado } from "../../features/authSlice.js";
import Boton from "../Boton.jsx";
import Tarjeta from "../Tarjeta.jsx";

export default function CambioPlan() {
  const dispatch = useDispatch();
  const plan = useSelector((state) => state.auth.usuario?.plan || "plus");

  const cambiar = async () => {
    try {
      const respuesta = await api.patch("/usuarios/plan", { plan: "premium" });
      dispatch(actualizarUsuarioAutenticado(respuesta.data.data?.usuario || respuesta.data.data));
      toast.success("Plan actualizado a premium");
    } catch (error) {
      toast.error(error.message || "No se pudo cambiar el plan");
    }
  };

  if (plan !== "plus") {
    return (
      <Tarjeta className="relative overflow-hidden border-amber-200 bg-amber-50">
        <div className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-2xl bg-white text-amber-600 shadow-sm"><Crown size={24} /></div>
        <p className="text-xs font-black uppercase tracking-wider text-amber-700">Cook Book premium</p>
        <h3 className="mt-1 pr-16 text-xl font-black text-stone-900">Plan premium activo</h3>
        <p className="mt-2 max-w-lg text-stone-600">Tenes publicaciones sin limite y acceso completo.</p>
      </Tarjeta>
    );
  }

  return (
    <Tarjeta className="relative overflow-hidden border-amber-200 bg-amber-50">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/70" />
      <div className="relative">
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-amber-600 shadow-sm ring-1 ring-amber-100">
          <Crown size={24} />
        </div>
        <p className="text-xs font-black uppercase tracking-wider text-amber-700">Upgrade disponible</p>
        <h3 className="mt-1 text-xl font-black text-stone-900">Mejora a premium</h3>
        <p className="mt-2 text-stone-600">Publica mas recetas, guarda tu crecimiento y prepara la defensa con plan completo.</p>
        <Boton className="mt-4" onClick={cambiar}>Cambiar a premium</Boton>
      </div>
    </Tarjeta>
  );
}
