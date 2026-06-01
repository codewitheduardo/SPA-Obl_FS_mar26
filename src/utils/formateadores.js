export function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  return new Intl.DateTimeFormat("es-UY", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(fecha));
}

export function formatearDificultad(dificultad = "") {
  const valor = dificultad.toLowerCase();
  return valor.charAt(0).toUpperCase() + valor.slice(1);
}

export function obtenerEstilosDificultad(dificultad = "") {
  const estilos = {
    facil: "bg-emerald-100 text-emerald-700",
    media: "bg-amber-100 text-amber-700",
    dificil: "bg-rose-100 text-rose-700",
  };
  return estilos[dificultad] || "bg-stone-100 text-stone-700";
}

