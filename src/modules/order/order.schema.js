import joi from 'joi'
import { ObjectIdValidation } from '../../middleware/validation.middleware.js'

// signup
export const createOrderSchema = joi.object({
    phone:joi.string().length(11).required(),
    address:joi.string().required(),
    payment:joi.string().valid("cash","visa"),
    coupon:joi.string().length(6)
}).required()


export const cancelOrderSchema = joi.object({
    orderId:joi.string().custom(ObjectIdValidation).required(),
}).required()

