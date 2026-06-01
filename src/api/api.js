import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

const convertirMensaje = (valor) => {
  if (!valor) return "";
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor)) return valor.map(convertirMensaje).filter(Boolean).join(", ");

  return valor.message || valor.msg || String(valor);
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const datosError = error.response?.data;
    const mensaje =
      convertirMensaje(datosError?.message || datosError?.error || datosError?.errors || datosError?.details) ||
      error.message ||
      "No se pudo completar la accion";

    return Promise.reject(new Error(mensaje));
  },
);

export default api;

