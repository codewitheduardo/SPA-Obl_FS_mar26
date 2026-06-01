import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: false }).required().messages({
    "string.base": "El email debe ser un texto",
    "string.empty": "El email es obligatorio",
    "string.email": "El email no tiene un formato valido",
    "any.required": "El email es obligatorio",
  }),
  password: Joi.string().required().messages({
    "string.base": "La password debe ser un texto",
    "string.empty": "La password es obligatoria",
    "any.required": "La password es obligatoria",
  }),
}).required();

export const registroSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede superar los 50 caracteres",
    "any.required": "El nombre es obligatorio",
  }),
  email: Joi.string().trim().email({ tlds: false }).required().messages({
    "string.base": "El email debe ser un texto",
    "string.empty": "El email es obligatorio",
    "string.email": "El email no tiene un formato valido",
    "any.required": "El email es obligatorio",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "string.base": "La password debe ser un texto",
    "string.empty": "La password es obligatoria",
    "string.min": "La password debe tener al menos 6 caracteres",
    "string.max": "La password no puede superar los 30 caracteres",
    "any.required": "La password es obligatoria",
  }),
  repetirPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Las passwords no coinciden",
    "any.required": "Repeti la password",
  }),
  rol: Joi.string().valid("chef", "lector").required().messages({
    "string.base": "El rol debe ser un texto",
    "any.only": "El rol debe ser chef o lector",
    "any.required": "El rol es obligatorio",
  }),
}).required();

