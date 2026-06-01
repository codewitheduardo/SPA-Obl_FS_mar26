import { Bot, BookOpen, ChefHat, FolderHeart, Heart, Home, LogOut, Menu, Sparkles, Tags, User } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cerrarSesion } from "../../features/authSlice.js";
import Boton from "../Boton.jsx";

const enlaces = [
  { to: "/dashboard", texto: "Dashboard", icono: Home },
  { to: "/recetas", texto: "Comunidad", icono: BookOpen },
  { to: "/mis-recetas", texto: "Mis recetas", icono: ChefHat },
  { to: "/categorias", texto: "Categorias", icono: Tags },
  { to: "/recetas-externas", texto: "TheMealDB", icono: Sparkles },
  { to: "/favoritos", texto: "Favoritos", icono: Heart },
  { to: "/ia", texto: "IA recetas", icono: Bot },
  { to: "/perfil", texto: "Perfil", icono: User },
];

export default function BarraLateral() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [abierta, setAbierta] = useState(false);

  const salir = () => {
    dispatch(cerrarSesion());
    toast.info("Sesion cerrada");
    navigate("/login");
  };

  const navegarDesdeMenu = (ruta) => {
    setAbierta(false);
    if (location.pathname === ruta) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {abierta && <button className="fixed inset-0 z-20 bg-stone-950/30 md:hidden" onClick={() => setAbierta(false)} aria-label="Cerrar menu" />}
      <button className="fixed left-4 top-4 z-40 rounded-xl border border-stone-200 bg-white p-3 shadow-sm md:hidden" onClick={() => setAbierta((valor) => !valor)} aria-label="Abrir menu">
        <Menu size={20} />
      </button>
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-[min(18rem,86vw)] flex-col overflow-y-auto border-r border-stone-200 bg-white px-5 py-6 shadow-sm transition-transform md:w-72 md:translate-x-0 ${abierta ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-700 ring-1 ring-orange-100">
            <FolderHeart size={24} />
          </div>
          <div>
            <p className="text-xl font-black text-stone-900">Cook Book</p>
            <p className="text-xs font-semibold text-stone-500">Recetas, planes y cocina</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {enlaces.map(({ to, texto, icono: Icono }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-orange-50 text-orange-700" : "text-stone-600 hover:bg-stone-50 hover:text-stone-950"}`}
              onClick={() => navegarDesdeMenu(to)}
            >
              <Icono size={18} />
              {texto}
            </NavLink>
          ))}
        </nav>
        <Boton variante="outline" className="mt-8 w-full shrink-0" onClick={salir}>
          <LogOut size={18} />
          Logout
        </Boton>
      </aside>
    </>
  );
}

