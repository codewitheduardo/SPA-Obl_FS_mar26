import { Bot, BookOpen, ChefHat, FolderHeart, Heart, Home, LogOut, Menu, Sparkles, Tags, User, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cerrarSesion } from "../features/authSlice.js";

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
    if (location.pathname === ruta) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {abierta && (
        <button
          className="fixed inset-0 z-20 bg-stone-950/30 md:hidden"
          onClick={() => setAbierta(false)}
          aria-label="Cerrar menu"
        />
      )}

      <button
        className="fixed left-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white shadow-card text-stone-600 transition hover:bg-stone-50 md:hidden"
        onClick={() => setAbierta((v) => !v)}
        aria-label="Abrir menu"
      >
        {abierta ? <X size={16} /> : <Menu size={16} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[min(17rem,88vw)] flex-col border-r border-stone-200 bg-white shadow-sidebar transition-transform duration-200 md:w-64 md:translate-x-0 ${
          abierta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3.5 border-b border-stone-100 px-5 py-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 shadow-btn">
            {/* Favicon inline — gorro de chef */}
            <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 12 C24 12 18 18 18 25 C18 29 20 32 23 34 L41 34 C44 32 46 29 46 25 C46 18 40 12 32 12 Z" fill="white"/>
              <rect x="17" y="35" width="30" height="8" rx="3" fill="white"/>
              <rect x="19" y="43" width="26" height="5" rx="2" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-base font-black leading-tight text-stone-900">Cook Book</p>
            <p className="mt-0.5 text-xs text-stone-400">Tu recetario digital</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Navegacion
          </p>
          <div className="space-y-0.5">
            {enlaces.map(({ to, texto, icono: Icono }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-orange-50 text-orange-700"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`
                }
                onClick={() => navegarDesdeMenu(to)}
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${isActive ? "text-orange-600" : "text-stone-400"}`}>
                      <Icono size={15} />
                    </span>
                    {texto}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-stone-100 p-3">
          <button
            type="button"
            onClick={salir}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-stone-500 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <span className="flex h-6 w-6 items-center justify-center text-stone-400">
              <LogOut size={15} />
            </span>
            Cerrar sesion
          </button>
        </div>
      </aside>
    </>
  );
}
