import Joi from "joi";

export const comentarioSchema = Joi.object({
  texto: Joi.string().trim().min(3).max(500).required().messages({
    "string.empty": "El texto es obligatorio",
    "string.min": "El texto debe tener al menos 3 caracteres",
    "string.max": "El texto no puede superar los 500 caracteres",
    "any.required": "El texto es obligatorio",
  }),
  valoracion: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "La valoracion debe ser un numero",
    "number.integer": "La valoracion debe ser un numero entero",
    "number.min": "La valoracion minima es 1",
    "number.max": "La valoracion maxima es 5",
    "any.required": "La valoracion es obligatoria",
  }),
});

