import Joi = require ('joi');

const UserValidation = Joi.object({
  username: Joi.string(),
  role: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
});

const LoginValidation = Joi.object({
  email: Joi.string().email(),
  password: Joi.string(),
});

export { UserValidation, LoginValidation };
