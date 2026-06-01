import { ImageUp } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api.js";

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
    <label className="block cursor-pointer rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-5 text-center transition hover:bg-orange-50">
      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(evento) => manejarArchivo(evento.target.files?.[0])} />
      {preview ? <img src={preview} alt="Vista previa" className="mx-auto mb-4 h-40 w-full rounded-2xl object-cover" /> : <ImageUp className="mx-auto mb-3 text-orange-500" size={34} />}
      <span className="block font-bold text-stone-800">Arrastra una imagen o selecciona un archivo</span>
      <span className="mt-1 block text-sm text-stone-500">JPG, PNG o WEBP</span>
      <span className="mt-2 block text-xs text-stone-400">{subiendo ? "Subiendo imagen..." : "Preparado para POST /uploads"}</span>
    </label>
  );
}

