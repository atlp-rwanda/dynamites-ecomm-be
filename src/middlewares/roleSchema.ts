import Joi from 'joi';

export const createRoleSchema = Joi.object({
  name: Joi.string().min(3).max(10).required(),
  permissions: Joi.array().required(),
});

export const updateRoleSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().min(3).max(10).required(),
  permissions: Joi.array().required(),
});

export const changeRoleSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  newRoleId: Joi.number().integer().positive().required(),
});
