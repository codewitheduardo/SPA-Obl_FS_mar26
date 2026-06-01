import Joi from "joi";

export const iaSchema = Joi.object({
  ingredientes: Joi.string().trim().min(3).max(1000).required().messages({
    "string.empty": "Ingresa al menos un ingrediente",
    "string.min": "Ingresa al menos 3 caracteres",
    "string.max": "No puede superar los 1000 caracteres",
    "any.required": "Ingresa al menos un ingrediente",
  }),
  tipoComida: Joi.string().allow("").optional(),
  tiempoMaximo: Joi.number().integer().min(1).max(1440).allow("").optional(),
  dificultad: Joi.string().valid("facil", "media", "dificil").required(),
  preferencias: Joi.string().allow("").optional(),
});

