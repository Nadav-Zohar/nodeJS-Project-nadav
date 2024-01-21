import Joi from "joi";

export const bizNumberValidate = Joi.object({
  bizNumber: Joi.string().length(7).required().messages({
    "string.length": "bizNumber must be 7 characters",
    "any.required": "bizNumber is required",
  }),
});
