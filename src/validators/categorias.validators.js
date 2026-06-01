import Joi from "joi";

export const categoriaSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(40).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede superar los 40 caracteres",
    "any.required": "El nombre es obligatorio",
  }),
  descripcion: Joi.string().trim().max(200).allow("").optional().messages({
    "string.max": "La descripcion no puede superar los 200 caracteres",
  }),
});

