import Joi from "joi";

const dificultadValores = ["facil", "media", "dificil"];

export const recetaSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "El titulo es obligatorio",
    "string.min": "El titulo debe tener al menos 3 caracteres",
    "string.max": "El titulo no puede superar los 100 caracteres",
    "any.required": "El titulo es obligatorio",
  }),
  descripcion: Joi.string().trim().min(10).max(500).required().messages({
    "string.empty": "La descripcion es obligatoria",
    "string.min": "La descripcion debe tener al menos 10 caracteres",
    "string.max": "La descripcion no puede superar los 500 caracteres",
    "any.required": "La descripcion es obligatoria",
  }),
  ingredientes: Joi.array().items(
    Joi.object({
      valor: Joi.string().trim().allow("").messages({
        "string.empty": "El ingrediente no puede quedar vacio",
      }),
    }),
  ).custom((items, helpers) => {
    const validos = items.filter((item) => item.valor && item.valor.trim().length >= 2);
    if (validos.length === 0) return helpers.error("array.min");
    return validos;
  }).required().messages({
    "array.min": "Debes ingresar al menos un ingrediente",
    "any.required": "Los ingredientes son obligatorios",
  }),
  pasos: Joi.array().items(
    Joi.object({
      valor: Joi.string().trim().allow("").messages({
        "string.empty": "El paso no puede quedar vacio",
      }),
    }),
  ).custom((items, helpers) => {
    const validos = items.filter((item) => item.valor && item.valor.trim().length >= 5);
    if (validos.length === 0) return helpers.error("array.min");
    return validos;
  }).required().messages({
    "array.min": "Debes ingresar al menos un paso",
    "any.required": "Los pasos son obligatorios",
  }),
  tiempoPreparacion: Joi.number().integer().min(1).max(1440).required().messages({
    "number.base": "El tiempo de preparacion debe ser un numero",
    "number.integer": "El tiempo de preparacion debe ser un numero entero",
    "number.min": "El tiempo de preparacion debe ser al menos 1 minuto",
    "number.max": "El tiempo de preparacion no puede superar los 1440 minutos",
    "any.required": "El tiempo de preparacion es obligatorio",
  }),
  porciones: Joi.number().integer().min(1).max(50).required().messages({
    "number.base": "Las porciones deben ser un numero",
    "number.integer": "Las porciones deben ser un numero entero",
    "number.min": "Debe haber al menos 1 porcion",
    "number.max": "Las porciones no pueden superar 50",
    "any.required": "Las porciones son obligatorias",
  }),
  dificultad: Joi.string().valid(...dificultadValores).required().messages({
    "any.only": "La dificultad debe ser facil, media o dificil",
    "any.required": "La dificultad es obligatoria",
  }),
  categoriaId: Joi.string().required().messages({
    "string.empty": "La categoria es obligatoria",
    "any.required": "La categoria es obligatoria",
  }),
  estado: Joi.string().valid("publicada", "borrador").required().messages({
    "any.only": "La visibilidad debe ser publicada o borrador",
    "any.required": "La visibilidad es obligatoria",
  }),
  imagen: Joi.any().optional().custom((value, helpers) => {
    const file = value?.[0];
    if (!file) return value;
    if (!file.type?.startsWith("image/")) return helpers.error("any.invalid");
    return value;
  }).messages({
    "any.invalid": "Debes seleccionar una imagen válida (JPG, PNG o WEBP)",
  }),
}).unknown(true);

