import { Router } from 'express'
import * as jobController from './job.controller.js'
import * as JobsSchemas from './job.schema.js'
import { validation } from '../../middleware/validation.middleware.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js'
import { isAuthorized } from './../../middleware/authorization.middleware.js';
import { fileValidation, uploadFileCloud } from '../../utils/multer.js'

const router = Router()

// Add Job 
router.post("/addjob", validation(JobsSchemas.addJobSchema), isAuthenticated, isAuthorized("hr"), jobController.addJob)

// Update Job 
router.patch("/update-job/:companyId/:jobId", validation(JobsSchemas.updateJobSchema), isAuthenticated, isAuthorized("hr"), jobController.updateJob)

// Delete Job 
router.delete("/delete-job/:companyId/:jobId", validation(JobsSchemas.deleteJobSchema), isAuthenticated, isAuthorized("hr"), jobController.deleteJob)

// Get all Jobs with their company’s information
router.get("/get-all-job", jobController.getAllJobs)

// Get all Jobs a specific company
router.get("/get-specific-job/:companyId", validation(JobsSchemas.getAllSpecificJobSchema), isAuthenticated, jobController.getAllSpecificJob)

// Get all Jobs that match the following filters 
router.get("/get-filters-job", validation(JobsSchemas.getAllFiltersJobsSchema), isAuthenticated, jobController.getAllFiltersJobs)

// Apply to Job 
router.post("/apply-to-job/:jobId", isAuthenticated, isAuthorized("user"), validation(JobsSchemas.applyJobsSchema),
    uploadFileCloud({ filter: fileValidation.files }).single("pp"), jobController.applyJobs)

export default router

