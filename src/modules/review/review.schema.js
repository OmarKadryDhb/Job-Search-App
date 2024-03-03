import joi from 'joi'
import { ObjectIdValidation } from '../../middleware/validation.middleware.js'

// signup
export const addReviewSchema = joi.object({
    productId:joi.string().custom(ObjectIdValidation).required(),
    comment:joi.string().required(),
    rating:joi.number().min(1).max(5).required()
}).required()


export const updateReviewSchema = joi.object({
    reviewId:joi.string().custom(ObjectIdValidation).required(),
    comment:joi.string(),
    rating:joi.number().min(1).max(5),
    productId:joi.string().custom(ObjectIdValidation).required(),
}).required()

