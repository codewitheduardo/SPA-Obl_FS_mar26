export function obtenerIngredientesMealDB(meal = {}) {
  return Array.from({ length: 20 }, (_, indice) => indice + 1)
    .map((numero) => ({
      ingrediente: meal[`strIngredient${numero}`]?.trim(),
      medida: meal[`strMeasure${numero}`]?.trim(),
    }))
    .filter((item) => item.ingrediente);
}

export function extraerMeals(respuesta) {
  const data = respuesta?.data?.data || respuesta?.data || respuesta;
  const posibleLista = data?.meals || data?.results || data?.recetas || data;

  if (Array.isArray(posibleLista)) return posibleLista.filter(Boolean);
  if (posibleLista?.idMeal) return [posibleLista];
  return [];
}

export function extraerMeal(respuesta) {
  return extraerMeals(respuesta)[0] || null;
}

export function extraerCategoriasMealDB(respuesta) {
  const data = respuesta?.data?.data || respuesta?.data || respuesta;
  const categorias = data?.categories || data?.categorias || data?.categoriasExternas || data?.meals || data?.results || data;
  if (!Array.isArray(categorias)) return [];

  return [...new Set(categorias
    .map((categoria) => categoria?.strCategory || categoria?.nombre || categoria?.name || categoria?.categoria || categoria)
    .map((categoria) => (typeof categoria === "string" ? categoria.trim() : ""))
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

export function obtenerCategoriaMealDB(receta = {}) {
  return receta.strCategory || receta.categoria || receta.category || "";
}

export function obtenerNombreMealDB(receta = {}) {
  return receta.strMeal || receta.nombre || receta.name || "";
}

export function filtrarMealsPorCategoria(meals = [], categoria = "") {
  if (!categoria) return meals;
  return meals.filter((meal) => obtenerCategoriaMealDB(meal).toLowerCase() === categoria.toLowerCase());
}

export function obtenerCategoriasDesdeMeals(meals = []) {
  return [...new Set(meals
    .map((meal) => obtenerCategoriaMealDB(meal))
    .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));
}

export function esFavoritoMealDB(respuesta) {
  const data = respuesta?.data?.data || respuesta?.data || respuesta;
  return Boolean(data?.esFavorito || data?.favorito || data?.exists || data?.mealDbId || data === true);
}

export function extraerFavoritoMealDB(respuesta, meal) {
  const data = respuesta?.data?.data || respuesta?.data || {};
  const favorito = data?.favorito || data;
  if (favorito?.mealDbId) return favorito;

  return {
    mealDbId: meal.idMeal,
    nombre: meal.strMeal,
    imagenUrl: meal.strMealThumb,
    categoria: meal.strCategory,
    area: meal.strArea,
  };
}

