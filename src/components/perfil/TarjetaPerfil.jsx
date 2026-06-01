import { Camera, ImageUp, Mail, ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/api.js";
import { actualizarUsuarioAutenticado } from "../../features/authSlice.js";
import Boton from "../Boton.jsx";
import Insignia from "../Insignia.jsx";
import Tarjeta from "../Tarjeta.jsx";

const obtenerFotosUsuario = (usuario = {}) =>
  [usuario.foto, usuario.fotoUrl]
    .filter(Boolean)
    .filter((url, indice, lista) => lista.indexOf(url) === indice);

export default function TarjetaPerfil({ usuario }) {
  const dispatch = useDispatch();
  const [subiendo, setSubiendo] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [preview, setPreview] = useState(null);
  const [indiceFoto, setIndiceFoto] = useState(0);
  const fotos = obtenerFotosUsuario(usuario);
  const foto = fotos[indiceFoto] || "";
  const inicial = usuario.nombre?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    setIndiceFoto(0);
  }, [usuario.foto, usuario.fotoUrl]);

  const seleccionarArchivo = (archivo) => {
    if (!archivo) return;
    setArchivoSeleccionado(archivo);
    setPreview(URL.createObjectURL(archivo));
  };

  const cancelarCambioFoto = () => {
    setArchivoSeleccionado(null);
    setPreview(null);
  };

  const actualizarFotoPerfil = async () => {
    if (!archivoSeleccionado) {
      toast.info("Selecciona una imagen antes de actualizar");
      return;
    }

    try {
      setSubiendo(true);
      const formData = new FormData();
      formData.append("foto", archivoSeleccionado);
      const respuesta = await api.patch("/usuarios/foto", formData);
      dispatch(actualizarUsuarioAutenticado(respuesta.data.data?.usuario || respuesta.data.data));
      cancelarCambioFoto();
      toast.success("Foto actualizada");
    } catch (error) {
      toast.error(error.message || "No se pudo subir la foto");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <Tarjeta className="overflow-hidden p-0">
      <div className="border-b border-stone-100 bg-stone-50/70 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="relative h-28 w-28 shrink-0">
            {foto ? (
              <img
                src={foto}
                alt={usuario.nombre}
                referrerPolicy="no-referrer"
                className="h-28 w-28 rounded-3xl object-cover shadow-sm ring-4 ring-white"
                onError={() => setIndiceFoto((actual) => actual + 1)}
              />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-3xl bg-white text-4xl font-black text-stone-700 shadow-sm ring-1 ring-stone-200">{inicial}</div>
            )}
            <span className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-2xl bg-white text-orange-600 shadow-sm ring-1 ring-orange-100"><Camera size={18} /></span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-wide text-stone-500">Mi perfil</p>
            <h2 className="mt-1 truncate text-3xl font-black text-stone-900">{usuario.nombre || "Usuario"}</h2>
            <p className="mt-1 flex items-center gap-2 text-stone-600"><Mail size={16} /> {usuario.email || "Sin email"}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Insignia className="bg-lime-100 text-lime-700">{usuario.rol || "lector"}</Insignia>
              <Insignia className="bg-stone-100 text-stone-700">{usuario.proveedor || "local"}</Insignia>
              <Insignia className="bg-amber-100 text-amber-700">{usuario.plan || "plus"}</Insignia>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-6 lg:grid-cols-[1fr_18rem]">
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <h3 className="flex items-center gap-2 font-black text-stone-900"><ShieldCheck size={18} className="text-emerald-600" /> Datos de cuenta</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3">
              <p className="text-xs font-black uppercase text-stone-400">Rol</p>
              <p className="mt-1 font-black capitalize text-stone-900">{usuario.rol || "lector"}</p>
            </div>
            <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3">
              <p className="text-xs font-black uppercase text-stone-400">Proveedor</p>
              <p className="mt-1 font-black capitalize text-stone-900">{usuario.proveedor || "local"}</p>
            </div>
            <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3">
              <p className="text-xs font-black uppercase text-stone-400">Plan</p>
              <p className="mt-1 font-black capitalize text-stone-900">{usuario.plan || "plus"}</p>
            </div>
            <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3">
              <p className="text-xs font-black uppercase text-stone-400">Estado</p>
              <p className="mt-1 font-black text-emerald-700">Activa</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 font-black text-stone-900"><UserRound size={18} className="text-orange-600" /> Foto de perfil</h3>
          <label className="block cursor-pointer rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-4 text-center transition hover:bg-orange-100/60">
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(evento) => seleccionarArchivo(evento.target.files?.[0])} />
            {preview ? (
              <img src={preview} alt="Vista previa perfil" className="mx-auto mb-3 h-36 w-full rounded-2xl object-cover shadow-sm" />
            ) : (
              <ImageUp className="mx-auto mb-3 text-stone-500" size={34} />
            )}
            <span className="block font-bold text-stone-800">{archivoSeleccionado ? "Imagen lista para actualizar" : "Selecciona una nueva foto"}</span>
            <span className="mt-1 block text-sm text-stone-500">JPG, PNG o WEBP</span>
          </label>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Boton type="button" onClick={actualizarFotoPerfil} disabled={!archivoSeleccionado || subiendo}>
              <Camera size={17} /> {subiendo ? "Actualizando..." : "Actualizar foto"}
            </Boton>
            <Boton type="button" variante="outline" onClick={cancelarCambioFoto} disabled={!archivoSeleccionado || subiendo}>
              <X size={17} /> Cancelar
            </Boton>
          </div>
        </div>
      </div>
    </Tarjeta>
  );
}
