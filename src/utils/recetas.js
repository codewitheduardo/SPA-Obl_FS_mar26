export function esRecetaBorrador(receta = {}) {
  return receta.estado === "borrador";
}

export function obtenerEstadoReceta(receta = {}) {
  return receta.estado === "borrador" ? "borrador" : "publicada";
}

export function obtenerId(valor) {
  if (!valor) return "";
  return typeof valor === "object" ? valor._id || valor.id || "" : valor;
}

export function obtenerIdReceta(receta = {}) {
  return obtenerId(receta._id || receta.id);
}

export function obtenerIdCategoriaReceta(receta = {}) {
  return obtenerId(receta.categoriaId || receta.categoria);
}

export function obtenerAutorReceta(receta = {}) {
  if (receta.usuarioId && typeof receta.usuarioId === "object") return receta.usuarioId;
  if (receta.usuario && typeof receta.usuario === "object") return receta.usuario;
  return null;
}

export function obtenerIdAutorReceta(receta = {}) {
  return obtenerId(receta.usuarioId) || obtenerId(receta.usuario);
}

export function completarAutorReceta(receta = {}, usuarioActual = {}) {
  const autor = obtenerAutorReceta(receta) || {};
  const idAutor = String(obtenerIdAutorReceta(receta));
  const idUsuario = String(obtenerId(usuarioActual));

  if (idAutor && idUsuario && idAutor === idUsuario) {
    return { ...usuarioActual, ...autor };
  }

  return Object.keys(autor).length ? autor : null;
}

export function crearFormDataReceta(datos = {}) {
  const formData = new FormData();
  const ingredientes = Array.isArray(datos.ingredientes)
    ? datos.ingredientes
    : String(datos.ingredientes || "").split(",").map((ingrediente) => ingrediente.trim()).filter(Boolean);
  const pasos = Array.isArray(datos.pasos)
    ? datos.pasos
    : String(datos.pasos || "").split(".").map((paso) => paso.trim()).filter(Boolean);

  formData.append("titulo", datos.titulo || "");
  formData.append("descripcion", datos.descripcion || "");
  ingredientes.forEach((ingrediente) => formData.append("ingredientes", ingrediente));
  pasos.forEach((paso) => formData.append("pasos", paso));
  formData.append("tiempoPreparacion", Number(datos.tiempoPreparacion || 0));
  formData.append("porciones", Number(datos.porciones || 0));
  formData.append("dificultad", datos.dificultad || "");
  formData.append("categoriaId", datos.categoriaId || "");
  formData.append("estado", datos.estado || "publicada");
  if (datos.imagen instanceof File) formData.append("imagen", datos.imagen);

  return formData;
}

export function extraerRecetaRespuesta(respuesta) {
  const cuerpo = respuesta?.data?.data || respuesta?.data;
  return cuerpo?.receta || cuerpo || {};
}

export function prepararRecetaGuardada(respuesta, datosFormulario = {}, recetaAnterior = {}) {
  const recetaGuardada = extraerRecetaRespuesta(respuesta);

  return {
    ...recetaAnterior,
    ...recetaGuardada,
    estado: datosFormulario.estado || recetaGuardada.estado || recetaAnterior.estado || "publicada",
  };
}
