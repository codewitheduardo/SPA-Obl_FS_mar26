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
    if (location.pathname === ruta) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {abierta && (
        <button
          className="fixed inset-0 z-20 bg-stone-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setAbierta(false)}
          aria-label="Cerrar menu"
        />
      )}

      <button
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white shadow-card text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 md:hidden"
        onClick={() => setAbierta((v) => !v)}
        aria-label="Abrir menu"
      >
        {abierta ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[min(17rem,88vw)] flex-col border-r border-stone-200 bg-white transition-transform duration-200 md:w-64 md:translate-x-0 ${
          abierta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
            <FolderHeart size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-base font-black leading-none text-stone-900">Cook Book</p>
            <p className="mt-0.5 truncate text-[11px] text-stone-400">Recetas & cocina</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Navegacion
          </p>
          <div className="space-y-0.5">
            {enlaces.map(({ to, texto, icono: Icono }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-orange-50 text-orange-700"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`
                }
                onClick={() => navegarDesdeMenu(to)}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                        isActive
                          ? "bg-orange-100 text-orange-700"
                          : "text-stone-400 group-hover:text-stone-600"
                      }`}
                    >
                      <Icono size={15} />
                    </span>
                    {texto}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-500" />
                    )}
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
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-500 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400">
              <LogOut size={15} />
            </span>
            Cerrar sesion
          </button>
        </div>
      </aside>
    </>
  );
}
