import { createSlice } from "@reduxjs/toolkit";
import { esRecetaBorrador } from "../utils/recetas.js";

const recetasSlice = createSlice({
  name: "recetas",
  initialState: {
    items: [],
    misRecetas: [],
    recetaSeleccionada: null,
    filtros: { titulo: "", categoriaId: "", dificultad: "", tiempoMaximo: "", ingrediente: "" },
    cargando: false,
    error: null,
  },
  reducers: {
    iniciarCargaRecetas: (state) => {
      state.cargando = true;
      state.error = null;
    },
    guardarRecetas: (state, action) => {
      state.cargando = false;
      state.items = action.payload.filter((receta) => !esRecetaBorrador(receta));
    },
    guardarMisRecetas: (state, action) => {
      state.cargando = false;
      state.misRecetas = action.payload;
      const idsBorrador = new Set(action.payload.filter(esRecetaBorrador).map((receta) => receta._id || receta.id));
      state.items = state.items.filter((receta) => !idsBorrador.has(receta._id || receta.id));
    },
    guardarRecetaSeleccionada: (state, action) => {
      state.recetaSeleccionada = action.payload;
    },
    guardarErrorRecetas: (state, action) => {
      state.cargando = false;
      state.error = action.payload;
    },
    actualizarFiltrosRecetas: (state, action) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    agregarReceta: (state, action) => {
      if (!esRecetaBorrador(action.payload)) state.items.unshift(action.payload);
      state.misRecetas.unshift(action.payload);
    },
    actualizarReceta: (state, action) => {
      const id = action.payload?._id || action.payload?.id;
      state.items = state.items
        .filter((receta) => receta._id !== id && receta.id !== id)
        .concat(esRecetaBorrador(action.payload) ? [] : [action.payload]);
      state.misRecetas = state.misRecetas.map((receta) => (receta._id === id || receta.id === id ? action.payload : receta));
    },
    quitarReceta: (state, action) => {
      state.items = state.items.filter((receta) => receta._id !== action.payload && receta.id !== action.payload);
      state.misRecetas = state.misRecetas.filter((receta) => receta._id !== action.payload && receta.id !== action.payload);
    },
  },
});

export const {
  iniciarCargaRecetas,
  guardarRecetas,
  guardarMisRecetas,
  guardarRecetaSeleccionada,
  guardarErrorRecetas,
  actualizarFiltrosRecetas,
  agregarReceta,
  actualizarReceta,
  quitarReceta,
} = recetasSlice.actions;
export default recetasSlice.reducer;
