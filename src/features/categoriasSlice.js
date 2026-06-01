import { createSlice } from "@reduxjs/toolkit";

const categoriasSlice = createSlice({
  name: "categorias",
  initialState: { items: [], cargando: false, error: null },
  reducers: {
    iniciarCargaCategorias: (state) => {
      state.cargando = true;
      state.error = null;
    },
    guardarCategorias: (state, action) => {
      state.cargando = false;
      state.items = action.payload;
    },
    guardarErrorCategorias: (state, action) => {
      state.cargando = false;
      state.error = action.payload;
    },
    agregarCategoria: (state, action) => {
      state.items.push(action.payload);
    },
    actualizarCategoria: (state, action) => {
      const id = action.payload?._id || action.payload?.id;
      state.items = state.items.map((categoria) => (categoria._id === id || categoria.id === id ? action.payload : categoria));
    },
    quitarCategoria: (state, action) => {
      state.items = state.items.filter((categoria) => categoria._id !== action.payload && categoria.id !== action.payload);
    },
  },
});

export const { iniciarCargaCategorias, guardarCategorias, guardarErrorCategorias, agregarCategoria, actualizarCategoria, quitarCategoria } = categoriasSlice.actions;
export default categoriasSlice.reducer;
