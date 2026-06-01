import { joiResolver } from "@hookform/resolvers/joi";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api.js";
import { guardarErrorAuth, guardarSesion, iniciarCargaAuth } from "../../features/auth/authSlice.js";
import Boton from "../Boton.jsx";
import BotonGoogle from "./BotonGoogle.jsx";
import CampoTexto from "../ui/CampoTexto.jsx";
import MensajeError from "../ui/MensajeError.jsx";
import { loginSchema } from "../../validators/auth.validators.js";

export default function FormularioLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cargando, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: joiResolver(loginSchema), mode: "onChange" });
  const faltaCampo = !watch("email") || !watch("password");

  const enviar = async (datos) => {
    try {
      dispatch(iniciarCargaAuth());
      const respuesta = await api.post("/auth/login", datos);
      dispatch(guardarSesion(respuesta.data.data));
      toast.success("Login exitoso");
      navigate("/dashboard");
    } catch (error) {
      dispatch(guardarErrorAuth(error.message));
      toast.error(error.message || "No se pudo iniciar sesion");
    }
  };

  const continuarConGoogle = async (idToken) => {
    if (!idToken) return;

    try {
      dispatch(iniciarCargaAuth());
      const respuesta = await api.post("/auth/google", { idToken });
      dispatch(guardarSesion(respuesta.data.data));
      toast.success("Login con Google exitoso");
      navigate("/dashboard");
    } catch (error) {
      dispatch(guardarErrorAuth(error.message));
      toast.error(error.message || "No se pudo iniciar con Google");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(enviar)}>
      <CampoTexto label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <CampoTexto label="Password" type="password" error={errors.password?.message} {...register("password")} />
      <MensajeError mensaje={error} />
      <Boton type="submit" className="w-full" disabled={faltaCampo || cargando}>
        <LogIn size={18} />
        {cargando ? "Ingresando..." : "Iniciar sesion"}
      </Boton>
      <BotonGoogle disabled={cargando} onCredential={continuarConGoogle} />
    </form>
  );
}

