import joi from 'joi'
import { ObjectIdValidation } from '../../middleware/validation.middleware.js'

// addBrand
export const addBrandSchema = joi.object({
    brandName:joi.string().required(),
    categories:joi.array().items(joi.string().custom(ObjectIdValidation)).required()
}).required()

// updateBrand
export const updateBrandSchema = joi.object({
    brandName:joi.string(),
    brandId:joi.string().custom(ObjectIdValidation).required()
}).required()

// delete
export const deleteBrandSchema = joi.object({
    brandId:joi.string().custom(ObjectIdValidation).required()
}).required()