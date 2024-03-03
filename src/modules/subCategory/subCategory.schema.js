import joi from 'joi'
import { ObjectIdValidation } from '../../middleware/validation.middleware.js'

// signup
export const createSubCategorySchema = joi.object({
    subCategoryName:joi.string().lowercase().required(),
    categoryId:joi.custom(ObjectIdValidation).required()
}).required()

// updateCategorySchema
export const updateSubCategorySchema = joi.object({
    subCategoryName:joi.string().required(),
    categoryId:joi.custom(ObjectIdValidation).required(),
    subCategoryId:joi.custom(ObjectIdValidation).required()
}).required()

// deleteCategorySchema
export const deleteSubCategorySchema = joi.object({
    categoryId:joi.custom(ObjectIdValidation).required(),
    subCategoryId:joi.custom(ObjectIdValidation).required()
}).required()