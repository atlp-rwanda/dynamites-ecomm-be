import Joi from 'joi';


export const createReviewSchema = Joi.object({
    content: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    productId: Joi.number().required()
})