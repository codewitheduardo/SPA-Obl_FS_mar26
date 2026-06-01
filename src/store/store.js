import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import recetasReducer from "../features/recetasSlice.js";
import categoriasReducer from "../features/categoriasSlice.js";
import favoritosReducer from "../features/favoritosSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recetas: recetasReducer,
    categorias: categoriasReducer,
    favoritos: favoritosReducer,
  },
});

