import { ImageUp, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api.js";

export default function CajaSubidaImagen({ onChange, onUpload, previewInicial, folder = "uploads", subirAutomaticamente = false }) {
  const [preview, setPreview] = useState(previewInicial);
  const [subiendo, setSubiendo] = useState(false);

  const subirImagen = async (archivo) => {
    const formData = new FormData();
    formData.append("imagen", archivo);
    formData.append("folder", folder);
    const respuesta = await api.post("/uploads", formData);
    return respuesta.data?.data || respuesta.data;
  };

  const manejarArchivo = async (archivo) => {
    if (!archivo) return;
    setPreview(URL.createObjectURL(archivo));
    onChange?.(archivo);

    if (!subirAutomaticamente) return;

    try {
      setSubiendo(true);
      const imagenSubida = await subirImagen(archivo);
      onUpload?.(imagenSubida);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      toast.error(error.message || "No se pudo subir la imagen");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <label className="group block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 text-center transition-all hover:border-orange-300 hover:bg-orange-50/40">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(evento) => manejarArchivo(evento.target.files?.[0])}
      />
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Vista previa" className="h-44 w-full object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-950/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Upload size={20} className="text-white" />
            <span className="text-xs font-bold text-white">Cambiar imagen</span>
          </div>
        </div>
      ) : (
        <div className="px-5 py-8">
          <ImageUp size={32} className="mx-auto mb-3 text-stone-400 transition-colors group-hover:text-orange-500" />
          <p className="font-semibold text-stone-700">Arrastrá o seleccioná una imagen</p>
          <p className="mt-1 text-sm text-stone-400">JPG, PNG o WEBP</p>
        </div>
      )}
      <div className="border-t border-stone-100 px-4 py-2">
        <span className="text-xs text-stone-400">
          {subiendo ? "Subiendo imagen..." : preview ? "Clic para cambiar" : "Máx. recomendado: 5MB"}
        </span>
      </div>
    </label>
  );
}
