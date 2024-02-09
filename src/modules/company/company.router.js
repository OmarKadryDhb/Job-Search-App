import {Router} from 'express'
import * as companyController from './company.controller.js'
import * as CompanySchemas from './company.schema.js'
import { validation } from '../../middleware/validation.middleware.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js'
import { isAuthorized } from '../../middleware/authorization.middleware.js'

const router = Router()

//1 Add Company 
router.post("/addcompany",validation(CompanySchemas.addCompanySchema),isAuthenticated,companyController.addCompany)

//2 UpdateCompanyData
router.patch("/update-company-data/:companyId",validation(CompanySchemas.updateCompanyDataSchema),isAuthenticated,isAuthorized("hr"),companyController.UpdateCompanyData)

//3 DeleteCompanyData
router.delete("/delete-company-data/:companyId",validation(CompanySchemas.deleteCompanyDataSchema),isAuthenticated,isAuthorized("hr"),companyController.deleteCompanyData)

//4 Get Company Data
router.get("/get-company-data/:companyId",validation(CompanySchemas.getCompanySchema),isAuthenticated,isAuthorized("hr"),companyController.getCompany)

//5 Search For a Company
router.get("/search",validation(CompanySchemas.searchCompanySchema),isAuthenticated,isAuthorized("hr","user"),companyController.searchCompany)

//6 Get all applications for specific Jobs
router.get("/get-all-specific-jobs/:companyId/:jobId",isAuthenticated,isAuthorized("hr","user"),validation(CompanySchemas.getAllSpecificApplicationsSchema),companyController.getAllSpecificApplications)

export default router