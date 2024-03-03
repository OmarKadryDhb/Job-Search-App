import joi from 'joi'
import { ObjectIdValidation } from '../../middleware/validation.middleware.js'

// signup
export const createProductSchema = joi.object({
    productName:joi.string().min(7).max(30).required(),
    discription:joi.string().min(10).max(100).required(),
    availableItems:joi.number().integer().min(1).required(),
    price:joi.number().integer().min(1).required(),
    discount:joi.number().min(1).max(100),
    categoryId:joi.custom(ObjectIdValidation).required(),
    subcategoryId:joi.custom(ObjectIdValidation).required(),
    brandId:joi.custom(ObjectIdValidation).required()
}).required()

// updateCategorySchema
export const updateProductSchema = joi.object({
    productName:joi.string().required(),
    price:joi.number().integer().min(1).required(),
    productId:joi.custom(ObjectIdValidation).required()
}).required()

// deleteCategorySchema
export const deleteProductSchema = joi.object({
    produproductIdctId:joi.custom(ObjectIdValidation).required()
}).required()