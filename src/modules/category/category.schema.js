import joi from 'joi'
import { ObjectIdValidation } from '../../middleware/validation.middleware.js'

// signup
export const createCategorySchema = joi.object({
    categoryName:joi.string().required(),
}).required()

// updateCategorySchema
export const updateCategorySchema = joi.object({
    categoryName:joi.string().required(),
    categoryId:joi.custom(ObjectIdValidation).required(),
}).required()

// deleteCategorySchema
export const deleteCategorySchema = joi.object({
    categoryId:joi.custom(ObjectIdValidation).required(),
}).required()