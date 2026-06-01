import { joiResolver } from "@hookform/resolvers/joi";
import { Save, Tags } from "lucide-react";
import { useForm } from "react-hook-form";
import AreaTexto from "../ui/AreaTexto.jsx";
import Boton from "../ui/Boton.jsx";
import CampoTexto from "../ui/CampoTexto.jsx";
import { categoriaSchema } from "../../validators/categorias.validators.js";

export default function FormularioCategoria({ categoriaInicial, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: joiResolver(categoriaSchema),
    defaultValues: {
      nombre: categoriaInicial?.nombre || "",
      descripcion: categoriaInicial?.descripcion || "",
    },
  });
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3 border-b border-stone-100 pb-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-700"><Tags size={20} /></span>
          <div>
            <h3 className="font-black text-stone-900">Datos de la categoria</h3>
            <p className="text-sm text-stone-500">Nombre y descripcion para clasificar recetas.</p>
          </div>
        </div>
        <div className="grid gap-4">
          <CampoTexto label="Nombre" error={errors.nombre?.message} {...register("nombre")} />
          <AreaTexto label="Descripcion" error={errors.descripcion?.message} {...register("descripcion")} />
        </div>
      </section>
      <div className="flex justify-end">
        <Boton type="submit"><Save size={18} /> Guardar categoria</Boton>
      </div>
    </form>
  );
}

