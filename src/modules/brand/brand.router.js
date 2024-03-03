import {Router} from 'express'
import * as brandController from './brand.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as BrandSchemas from './brand.schema.js'
import { fileValidation, uploadFileCloud } from '../../utils/multer.js';
import { isAuthorized } from '../../middleware/authorization.middleware.js';

const router = Router()

//1 Create Brand
router.post("/create-brand",
    isAuthenticated,isAuthorized("seller","admin"),
    uploadFileCloud({ filter: fileValidation.files }).single("brand"),
    validation(BrandSchemas.addBrandSchema),
    brandController.addBrand)

// Update Brand
router.patch("/update-brand/:brandId",
    isAuthenticated,isAuthorized("seller","admin"),
    uploadFileCloud({ filter: fileValidation.files }).single("brand"),
    validation(BrandSchemas.updateBrandSchema),
    brandController.updateBrand)

// Delete Brand
router.delete("/delete-brand/:brandId",
    isAuthenticated,isAuthorized("seller","admin"),
    uploadFileCloud({ filter: fileValidation.files }).single("brand"),
    validation(BrandSchemas.deleteBrandSchema),
    brandController.deleteBrand)

// Get All Brand
router.get("/",
    isAuthenticated,isAuthorized("admin"),
    brandController.allBrands)


export default router
