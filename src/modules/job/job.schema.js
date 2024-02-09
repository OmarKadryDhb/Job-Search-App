import joi from "joi"
import { ObjectIdValidation } from "../../middleware/validation.middleware.js";

// add job 
export const addJobSchema = joi.object({
    companyName:joi.string().required(),
    jobTitle:joi.string().required(),
    jobLocation:joi.string().valid("onsite","remotely","hybrid").required(),
    workingTime:joi.string().valid("part-time","full-time").required(),
    seniorityLevel:joi.string().valid("Junior","Mid-Level","Team-Lead","CTO").required(),
    jobDescription:joi.string().required(),
    technicalSkills:joi.array().items(joi.string()).required(),
    softSkills:joi.array().items(joi.string()).required(),
    addedBy:joi.custom(ObjectIdValidation),
    companyId:joi.custom(ObjectIdValidation)
}).required()

// updateJobSchema
export const updateJobSchema = joi.object({
    seniorityLevel:joi.string().valid("Junior","Mid-Level","Team-Lead","CTO").required(),
    newTechnicalSkills:joi.array().items().required(),
    companyId:joi.custom(ObjectIdValidation),
    jobId:joi.custom(ObjectIdValidation)
}).required()


// deleteJobSchema
export const deleteJobSchema = joi.object({
    companyId:joi.custom(ObjectIdValidation),
    jobId:joi.custom(ObjectIdValidation)
}).required()

// getAllSpecificJobSchema
export const getAllSpecificJobSchema = joi.object({
    companyId:joi.custom(ObjectIdValidation)
}).required()

// getAllFiltersJobsSchema
export const getAllFiltersJobsSchema = joi.object({
    workingTime:joi.string().valid("part-time","full-time").required(),
    jobLocation:joi.string().valid("onsite","remotely","hybrid").required(),
    seniorityLevel:joi.string().valid("Junior","Mid-Level","Team-Lead","CTO").required(),
    jobTitle:joi.string().required(),
    technicalSkills:joi.array().items(joi.string()).required(),
}).required()


// applyJobsSchema
export const applyJobsSchema = joi.object({
    jobId:joi.custom(ObjectIdValidation).required(),
    userTechSkills:joi.array().items(joi.string().required()),
    userSoftSkills:joi.array().items(joi.string().required()),
}).required()
