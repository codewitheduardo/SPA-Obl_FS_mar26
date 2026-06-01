export function esRecetaBorrador(receta = {}) {
  return receta.estado === "borrador";
}

export function obtenerEstadoReceta(receta = {}) {
  return receta.estado === "borrador" ? "borrador" : "publicada";
}
