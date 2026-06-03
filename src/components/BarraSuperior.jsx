import { Bell, BookOpen, CheckCheck, ChefHat, Heart, LogOut, Search, Sparkles, Tags, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cerrarSesion } from "../features/authSlice.js";

const obtenerFotosUsuario = (usuario = {}) =>
  [usuario.foto, usuario.fotoUrl]
    .filter(Boolean)
    .filter((url, indice, lista) => lista.indexOf(url) === indice);

export default function BarraSuperior() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = useSelector((state) => state.auth.usuario);
  const recetas = useSelector((state) => state.recetas.items);
  const misRecetas = useSelector((state) => state.recetas.misRecetas);
  const favoritos = useSelector((state) => state.favoritos.items);
  const categorias = useSelector((state) => state.categorias.items);
  const contenedorNotificacionesRef = useRef(null);
  const contenedorPerfilRef = useRef(null);
  const [busqueda, setBusqueda] = useState("");
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [firmaLeida, setFirmaLeida] = useState("");
  const [indiceFoto, setIndiceFoto] = useState(0);

  const notificaciones = useMemo(() => [
    {
      id: "mis-recetas",
      titulo: misRecetas.length === 0 ? "Crea tu primera receta" : "Recetas propias actualizadas",
      detalle: misRecetas.length === 0 ? "Todavia no creaste recetas propias." : `Tenes ${misRecetas.length} recetas propias cargadas.`,
      ruta: "/mis-recetas",
      icono: ChefHat,
      tono: "orange",
    },
    {
      id: "categorias",
      titulo: categorias.length === 0 ? "Categorias pendientes" : "Categorias disponibles",
      detalle: categorias.length === 0 ? "No hay categorias cargadas desde la API." : `Hay ${categorias.length} categorias disponibles.`,
      ruta: "/categorias",
      icono: Tags,
      tono: "emerald",
    },
    {
      id: "favoritos",
      titulo: favoritos.length === 0 ? "Sin favoritos externos" : "Favoritos de TheMealDB",
      detalle: favoritos.length === 0 ? "No guardaste favoritos externos todavia." : `Tenes ${favoritos.length} favoritos guardados.`,
      ruta: "/favoritos",
      icono: Heart,
      tono: "rose",
    },
    {
      id: "comunidad",
      titulo: recetas.length === 0 ? "Comunidad sin resultados" : "Comunidad activa",
      detalle: recetas.length === 0 ? "La comunidad no tiene recetas visibles por ahora." : `La comunidad muestra ${recetas.length} recetas internas.`,
      ruta: "/recetas",
      icono: BookOpen,
      tono: "amber",
    },
  ], [misRecetas.length, categorias.length, favoritos.length, recetas.length]);

  const firmaNotificaciones = notificaciones.map((item) => `${item.id}:${item.detalle}`).join("|");
  const hayNovedades = firmaLeida !== firmaNotificaciones;
  const esPremium = usuario?.plan === "premium";
  const fotosUsuario = obtenerFotosUsuario(usuario);
  const fotoUsuario = fotosUsuario[indiceFoto] || "";

  const estilosNotificacion = {
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  };

  useEffect(() => {
    const texto = busqueda.trim();
    const params = new URLSearchParams(location.search);
    const busquedaActual = params.get("buscar") || "";
    if (!texto) {
      if (location.pathname === "/recetas" && busquedaActual) navigate("/recetas", { replace: true });
      return;
    }
    if (location.pathname !== "/recetas" || busquedaActual !== texto) {
      navigate(`/recetas?buscar=${encodeURIComponent(texto)}`, { replace: true });
    }
  }, [busqueda, location.pathname, location.search, navigate]);

  useEffect(() => {
    setNotificacionesAbiertas(false);
    if (location.pathname !== "/recetas") {
      setBusqueda("");
      return;
    }
    const textoUrl = new URLSearchParams(location.search).get("buscar") || "";
    setBusqueda(textoUrl);
  }, [location.pathname, location.search]);

  useEffect(() => { setIndiceFoto(0); }, [usuario?.foto, usuario?.fotoUrl]);

  useEffect(() => {
    const cerrarSiClickAfuera = (evento) => {
      if (notificacionesAbiertas && !contenedorNotificacionesRef.current?.contains(evento.target)) setNotificacionesAbiertas(false);
      if (menuPerfilAbierto && !contenedorPerfilRef.current?.contains(evento.target)) setMenuPerfilAbierto(false);
    };
    document.addEventListener("mousedown", cerrarSiClickAfuera);
    return () => document.removeEventListener("mousedown", cerrarSiClickAfuera);
  }, [notificacionesAbiertas, menuPerfilAbierto]);

  const buscar = (evento) => {
    evento.preventDefault();
    const texto = busqueda.trim();
    if (!texto) return;
    navigate(`/recetas?buscar=${encodeURIComponent(texto)}`);
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    if (location.pathname === "/recetas") navigate("/recetas", { replace: true });
  };

  const alternarNotificaciones = () => {
    setNotificacionesAbiertas((valor) => {
      const nuevoValor = !valor;
      if (nuevoValor) setFirmaLeida(firmaNotificaciones);
      return nuevoValor;
    });
  };

  const abrirNotificacion = (ruta) => {
    setFirmaLeida(firmaNotificaciones);
    setNotificacionesAbiertas(false);
    navigate(ruta);
  };

  const marcarLeidas = () => { setFirmaLeida(firmaNotificaciones); };
  const irAlPerfil = () => { setMenuPerfilAbierto(false); navigate("/perfil"); };
  const salir = () => {
    setMenuPerfilAbierto(false);
    dispatch(cerrarSesion());
    toast.info("Sesion cerrada");
    navigate("/login");
  };

  return (
    <header className="mb-6 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-card sm:px-5">
      {/* Search */}
      <form
        onSubmit={buscar}
        className="flex flex-1 items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 transition-all duration-150 focus-within:border-orange-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100"
      >
        <Search size={16} className="shrink-0 text-stone-400" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-stone-800 outline-none placeholder:text-stone-400"
          placeholder="Buscar recetas, categorias o ingredientes..."
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
        {busqueda && (
          <button
            type="button"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-200 hover:text-stone-700"
            onClick={limpiarBusqueda}
            aria-label="Limpiar busqueda"
          >
            <X size={13} />
          </button>
        )}
      </form>

      <div className="flex items-center gap-2">
        {/* Plan badge */}
        <button
          type="button"
          className={`hidden items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition hover:-translate-y-px sm:flex ${
            esPremium
              ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "border-lime-200 bg-lime-50 text-lime-700 hover:bg-lime-100"
          }`}
          onClick={() => navigate("/perfil")}
          title="Ver plan"
        >
          <Sparkles size={13} />
          <span className="capitalize">{usuario?.plan || "plus"}</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={contenedorNotificacionesRef}>
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:border-stone-300 hover:bg-stone-50 hover:text-stone-800"
            aria-label="Notificaciones"
            onClick={alternarNotificaciones}
          >
            <Bell size={16} />
            {hayNovedades && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
            )}
          </button>

          {notificacionesAbiertas && (
            <div className="absolute right-0 top-12 z-20 w-[min(24rem,90vw)] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-modal">
              <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-stone-900">Notificaciones</p>
                  <p className="text-xs text-stone-400">
                    {hayNovedades ? "Hay cambios recientes" : "Estas al dia"}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-orange-50 hover:text-orange-700"
                  onClick={marcarLeidas}
                >
                  <CheckCheck size={13} />
                  Leidas
                </button>
              </div>
              <div className="max-h-72 space-y-1 overflow-y-auto p-2">
                {notificaciones.map(({ id, titulo, detalle, ruta, icono: Icono, tono }) => (
                  <button
                    key={id}
                    type="button"
                    className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-stone-50"
                    onClick={() => abrirNotificacion(ruta)}
                  >
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${estilosNotificacion[tono]}`}>
                      <Icono size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-stone-800">{titulo}</span>
                        {hayNovedades && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-stone-500">{detalle}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={contenedorPerfilRef}>
          <button
            className="shrink-0 rounded-xl ring-orange-200 transition hover:ring-2"
            onClick={() => setMenuPerfilAbierto((valor) => !valor)}
            aria-label="Abrir menu de perfil"
          >
            {fotoUsuario ? (
              <img
                src={fotoUsuario}
                alt={usuario?.nombre}
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-xl object-cover"
                onError={() => setIndiceFoto((actual) => actual + 1)}
              />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-100 text-sm font-black text-orange-700">
                {usuario?.nombre?.[0] || "U"}
              </span>
            )}
          </button>

          {menuPerfilAbierto && (
            <div className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-modal">
              <div className="border-b border-stone-100 px-4 py-3">
                <p className="truncate text-sm font-bold text-stone-900">{usuario?.nombre || "Usuario"}</p>
                <p className="truncate text-xs text-stone-500">{usuario?.email || "Sin email"}</p>
              </div>
              <div className="p-1.5">
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-stone-900"
                  onClick={irAlPerfil}
                >
                  <UserRound size={15} className="text-stone-400" />
                  Mi perfil
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  onClick={salir}
                >
                  <LogOut size={15} className="text-rose-400" />
                  Cerrar sesion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
