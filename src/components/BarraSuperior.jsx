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
    orange: "bg-orange-50 text-orange-700 ring-orange-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
  };

  useEffect(() => {
    const texto = busqueda.trim();
    const params = new URLSearchParams(location.search);
    const busquedaActual = params.get("buscar") || "";

    if (!texto) {
      if (location.pathname === "/recetas" && busquedaActual) {
        navigate("/recetas", { replace: true });
      }
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

  useEffect(() => {
    setIndiceFoto(0);
  }, [usuario?.foto, usuario?.fotoUrl]);

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
      if (nuevoValor) {
        setFirmaLeida(firmaNotificaciones);
      }
      return nuevoValor;
    });
  };

  const abrirNotificacion = (ruta) => {
    setFirmaLeida(firmaNotificaciones);
    setNotificacionesAbiertas(false);
    navigate(ruta);
  };

  const marcarLeidas = () => {
    setFirmaLeida(firmaNotificaciones);
  };

  const irAlPerfil = () => {
    setMenuPerfilAbierto(false);
    navigate("/perfil");
  };

  const salir = () => {
    setMenuPerfilAbierto(false);
    dispatch(cerrarSesion());
    toast.info("Sesion cerrada");
    navigate("/login");
  };

  return (
    <header className="mb-6 grid gap-4 rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm sm:px-5 lg:grid-cols-[minmax(420px,1fr)_auto] lg:items-center">
      <form onSubmit={buscar} className="flex min-h-12 w-full min-w-0 items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 text-stone-500 transition focus-within:border-orange-300 focus-within:bg-white">
        <Search size={20} className="shrink-0 text-stone-400" />
        <input
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-stone-800 outline-none placeholder:text-stone-400"
          placeholder="Buscar recetas, categorias o ingredientes"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
        {busqueda && <button type="button" className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700" onClick={limpiarBusqueda} aria-label="Limpiar busqueda"><X size={18} /></button>}
      </form>

      <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end sm:gap-4">
        <div className="relative" ref={contenedorNotificacionesRef}>
          <button className="relative rounded-full border border-stone-200 bg-white p-3 text-stone-500 shadow-sm transition hover:bg-orange-50 hover:text-orange-700" aria-label="Notificaciones" onClick={alternarNotificaciones}>
            <Bell size={18} />
            {hayNovedades && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-400" />}
          </button>
          {notificacionesAbiertas && (
            <div className="absolute right-0 top-14 z-20 w-[min(26rem,88vw)] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 p-4">
                <div>
                  <p className="text-sm font-black text-stone-900">Notificaciones</p>
                  <p className="mt-1 text-xs font-semibold text-stone-500">{hayNovedades ? "Tenes cambios recientes en tu recetario." : "Estas al dia con Cook Book."}</p>
                </div>
                <button type="button" className="inline-flex items-center gap-1 rounded-full bg-stone-50 px-3 py-1.5 text-xs font-black text-stone-600 transition hover:bg-orange-50 hover:text-orange-700" onClick={marcarLeidas}>
                  <CheckCheck size={14} />
                  Leidas
                </button>
              </div>
              <div className="max-h-[22rem] space-y-2 overflow-y-auto p-3">
                {notificaciones.map(({ id, titulo, detalle, ruta, icono: Icono, tono }) => (
                  <button
                    key={id}
                    type="button"
                    className="grid w-full grid-cols-[42px_1fr] gap-3 rounded-2xl border border-transparent p-3 text-left transition hover:border-orange-100 hover:bg-orange-50/50"
                    onClick={() => abrirNotificacion(ruta)}
                  >
                    <span className={`grid h-10 w-10 place-items-center rounded-2xl ring-1 ${estilosNotificacion[tono]}`}>
                      <Icono size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-black text-stone-900">{titulo}</span>
                        {hayNovedades && <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-stone-600">{detalle}</span>
                      <span className="mt-2 block text-xs font-bold text-orange-700">Abrir seccion</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 sm:inline-flex ${
            esPremium
              ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
              : "border-lime-200 bg-lime-50 text-lime-800 hover:bg-lime-100"
          }`}
          onClick={() => navigate("/perfil")}
          title="Ver plan"
        >
          <span className={`grid h-8 w-8 place-items-center rounded-full ${esPremium ? "bg-amber-200/70 text-amber-800" : "bg-lime-200/70 text-lime-800"}`}>
            <Sparkles size={16} />
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-black uppercase tracking-wide opacity-70">Plan</span>
            <span className="block text-sm font-black capitalize">{usuario?.plan || "plus"}</span>
          </span>
        </button>
        <div className="relative" ref={contenedorPerfilRef}>
          <button className="shrink-0 rounded-full ring-orange-100 transition hover:ring-4" onClick={() => setMenuPerfilAbierto((valor) => !valor)} aria-label="Abrir menu de perfil">
            {fotoUsuario ? (
              <img
                src={fotoUsuario}
                alt={usuario?.nombre}
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-full object-cover"
                onError={() => setIndiceFoto((actual) => actual + 1)}
              />
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-full bg-orange-100 font-black text-orange-700">{usuario?.nombre?.[0] || "U"}</span>
            )}
          </button>
          {menuPerfilAbierto && (
            <div className="absolute right-0 top-14 z-20 w-64 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
              <div className="border-b border-stone-100 p-4">
                <p className="truncate font-black text-stone-900">{usuario?.nombre || "Usuario"}</p>
                <p className="truncate text-sm font-semibold text-stone-500">{usuario?.email || "Sin email"}</p>
              </div>
              <div className="p-2">
                <button type="button" className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-stone-700 transition hover:bg-orange-50 hover:text-orange-700" onClick={irAlPerfil}>
                  <UserRound size={18} />
                  Ir a mi perfil
                </button>
                <button type="button" className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50" onClick={salir}>
                  <LogOut size={18} />
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
