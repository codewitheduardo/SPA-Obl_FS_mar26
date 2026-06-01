import { createSlice } from "@reduxjs/toolkit";

const tokenGuardado = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");

const obtenerFotoUsuario = (usuario = {}) => usuario.foto || usuario.fotoUrl || "";

const normalizarUsuario = (usuario = {}, usuarioAnterior = {}) => {
  const fotoUrl = obtenerFotoUsuario(usuario) || obtenerFotoUsuario(usuarioAnterior);

  return {
    ...usuarioAnterior,
    ...usuario,
    fotoUrl,
  };
};

const leerUsuarioGuardado = () => {
  try {
    return usuarioGuardado ? normalizarUsuario(JSON.parse(usuarioGuardado)) : null;
  } catch {
    localStorage.removeItem("usuario");
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    usuario: leerUsuarioGuardado(),
    token: tokenGuardado || null,
    autenticado: Boolean(tokenGuardado),
    cargando: false,
    error: null,
  },
  reducers: {
    iniciarCargaAuth: (state) => {
      state.cargando = true;
      state.error = null;
    },
    guardarSesion: (state, action) => {
      const token = action.payload?.token;
      const usuario = action.payload?.usuario;
      state.cargando = false;
      state.token = token;
      state.usuario = normalizarUsuario(usuario);
      state.autenticado = Boolean(token);
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(state.usuario));
    },
    guardarErrorAuth: (state, action) => {
      state.cargando = false;
      state.error = action.payload;
    },
    actualizarUsuarioAutenticado: (state, action) => {
      state.usuario = normalizarUsuario(action.payload, state.usuario);
      localStorage.setItem("usuario", JSON.stringify(state.usuario));
    },
    cerrarSesion: (state) => {
      state.usuario = null;
      state.token = null;
      state.autenticado = false;
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    },
  },
});

export const { iniciarCargaAuth, guardarSesion, guardarErrorAuth, actualizarUsuarioAutenticado, cerrarSesion } = authSlice.actions;
export default authSlice.reducer;
