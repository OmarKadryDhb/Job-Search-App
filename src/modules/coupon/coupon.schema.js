import joi from 'joi'
import { ObjectIdValidation } from '../../middleware/validation.middleware.js'

// createCouponSchema
export const createCouponSchema = joi.object({
    discount:joi.number().integer().min(1).max(100).required(),
    expiredAt:joi.date().greater(Date.now()).required()
}).required()

// updateCouponSchema
export const updateCouponSchema = joi.object({
    discount:joi.number().integer().min(1).max(100),
    expiredAt:joi.date().greater(Date.now()).required(),
    couponCode:joi.string().length(6).required()
}).required()

// deleteCouponSchema
export const deleteCouponSchema = joi.object({
    couponCode:joi.string().length(6).required()
}).required()
