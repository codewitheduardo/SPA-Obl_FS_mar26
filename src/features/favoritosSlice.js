import { createSlice } from "@reduxjs/toolkit";

const favoritosSlice = createSlice({
  name: "favoritos",
  initialState: { items: [], cargando: false, error: null },
  reducers: {
    iniciarCargaFavoritos: (state) => {
      state.cargando = true;
      state.error = null;
    },
    guardarFavoritos: (state, action) => {
      state.cargando = false;
      state.items = action.payload;
    },
    guardarErrorFavoritos: (state, action) => {
      state.cargando = false;
      state.error = action.payload;
    },
    agregarFavoritoEstado: (state, action) => {
      const yaExiste = state.items.some((favorito) => favorito.mealDbId === action.payload?.mealDbId);
      if (!yaExiste && action.payload) state.items.push(action.payload);
    },
    quitarFavoritoEstado: (state, action) => {
      state.items = state.items.filter((favorito) => favorito.mealDbId !== action.payload);
    },
  },
});

export const { iniciarCargaFavoritos, guardarFavoritos, guardarErrorFavoritos, agregarFavoritoEstado, quitarFavoritoEstado } = favoritosSlice.actions;
export default favoritosSlice.reducer;
