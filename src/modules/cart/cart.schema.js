import joi from 'joi'
import { ObjectIdValidation } from '../../middleware/validation.middleware.js'

// signup
export const addToCartSchema = joi.object({
    productId:joi.string().custom(ObjectIdValidation).required(),
    quantity:joi.number().integer().min(1).required(),
}).required()

export const getUserCartSchema = joi.object({
    cartId:joi.string().custom(ObjectIdValidation),
}).required()

export const updateUserCartSchema = joi.object({
    productId:joi.string().custom(ObjectIdValidation).required(),
    quantity:joi.number().integer().min(1).required(),
}).required()

export const removeFromCartSchema = joi.object({
    productId:joi.string().custom(ObjectIdValidation).required(),
}).required()
