import { joiResolver } from "@hookform/resolvers/joi";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api.js";
import { guardarErrorAuth, guardarSesion, iniciarCargaAuth } from "../../features/auth/authSlice.js";
import Boton from "../Boton.jsx";
import CampoTexto from "../ui/CampoTexto.jsx";
import Selector from "../ui/Selector.jsx";
import MensajeError from "../ui/MensajeError.jsx";
import { registroSchema } from "../../validators/auth.validators.js";

export default function FormularioRegistro() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cargando, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({ resolver: joiResolver(registroSchema), mode: "onChange", defaultValues: { rol: "lector" } });
  const password = watch("password");

  const enviar = async (datos) => {
    try {
      const { nombre, email, password, rol } = datos;
      dispatch(iniciarCargaAuth());
      const respuesta = await api.post("/auth/register", { nombre, email, password, rol });
      dispatch(guardarSesion(respuesta.data.data));
      toast.success("Registro exitoso");
      navigate("/dashboard");
    } catch (error) {
      dispatch(guardarErrorAuth(error.message));
      toast.error(error.message || "No se pudo registrar el usuario");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(enviar)}>
      <CampoTexto label="Nombre" error={errors.nombre?.message} {...register("nombre")} />
      <CampoTexto label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <CampoTexto label="Password" type="password" error={errors.password?.message} {...register("password")} />
      <CampoTexto label="Repetir password" type="password" error={errors.repetirPassword?.message} {...register("repetirPassword")} />
      <Selector label="Rol" error={errors.rol?.message} {...register("rol")}>
        <option value="lector">Lector</option>
        <option value="chef">Chef</option>
      </Selector>
      <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-stone-600">Proveedor local y plan inicial plus se configuran automaticamente.</p>
      <MensajeError mensaje={error} />
      <Boton type="submit" className="w-full" disabled={!isValid || cargando}>
        <UserPlus size={18} />
        {cargando ? "Registrando..." : "Crear cuenta"}
      </Boton>
    </form>
  );
}

