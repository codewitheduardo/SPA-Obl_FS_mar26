import Joi from "joi";

export const iaSchema = Joi.object({
  ingredientes: Joi.string().trim().min(3).max(1000).required().messages({
    "string.empty": "Ingresá al menos un ingrediente",
    "string.min": "Ingresá al menos 3 caracteres",
    "string.max": "No puede superar los 1000 caracteres",
    "any.required": "Ingresá al menos un ingrediente",
  }),
  tipoComida: Joi.string().allow("").optional(),
  tiempoMaximo: Joi.number().integer().min(5).max(180).required().messages({
    "number.base": "Ingresá un número de minutos",
    "number.min": "El mínimo es 5 minutos",
    "number.max": "El máximo es 180 minutos",
    "any.required": "Ingresá el tiempo máximo",
  }),
  porciones: Joi.number().integer().min(1).max(8).required().messages({
    "number.base": "Seleccioná la cantidad de porciones",
    "any.required": "Seleccioná la cantidad de porciones",
  }),
  dificultad: Joi.string().valid("facil", "media", "dificil").required().messages({
    "any.only": "Seleccioná una dificultad válida",
    "any.required": "Seleccioná la dificultad",
  }),
  preferencias: Joi.string().allow("").max(300).optional().messages({
    "string.max": "No puede superar los 300 caracteres",
  }),
});
