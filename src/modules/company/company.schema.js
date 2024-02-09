import joi from 'joi'
import { ObjectIdValidation } from "../../middleware/validation.middleware.js";

// AddCompany
export const addCompanySchema = joi.object({
    companyName:joi.string().required(),
    description:joi.string().required(),
    industry:joi.string(),
    address:joi.string().required(),
    numberOfEmployees:joi.number().min(11).max(25).required(),
    companyEmail:joi.string().email().required(),
    companyHR:joi.custom(ObjectIdValidation)
}).required()

// Update Company
export const updateCompanyDataSchema = joi.object({
    companyId:joi.custom(ObjectIdValidation),
    newNumberOfEmployees:joi.number().min(11).max(25).required(),
}).required()

// Delete Company
export const deleteCompanyDataSchema = joi.object({
    companyId:joi.custom(ObjectIdValidation).required()
}).required()


// getCompanySchema
export const getCompanySchema = joi.object({
    companyId:joi.custom(ObjectIdValidation).required()
}).required()

// search Company
export const searchCompanySchema = joi.object({
    companyName:joi.string().required()
}).required()

// getAllSpecificApplicationsSchema
export const getAllSpecificApplicationsSchema = joi.object({
    companyId:joi.custom(ObjectIdValidation).required(),
    jobId:joi.custom(ObjectIdValidation).required(),
}).required()
