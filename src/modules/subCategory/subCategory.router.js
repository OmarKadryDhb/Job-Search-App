import {Router} from 'express'
import * as subCategoryController from './subCategory.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as SubCategorySchemas from './subCategory.schema.js'
import { isAuthorized } from './../../middleware/authorization.middleware.js';
import { fileValidation, uploadFileCloud } from '../../utils/multer.js'

const router = Router({mergeParams:true})

//1 All SubCategories
router.get("/",isAuthenticated,isAuthorized("admin"),
    subCategoryController.allSubCategories)

//2 Create Category
router.post("/create-subcategory",
    isAuthenticated,isAuthorized("seller","admin"),
    uploadFileCloud({ filter: fileValidation.files }).single("subcategory"),
    validation(SubCategorySchemas.createSubCategorySchema),
    subCategoryController.createSubCategory)

//3 Update Category
router.patch("/update-subcategory/:subCategoryId",
    isAuthenticated,isAuthorized("seller","admin"),
    uploadFileCloud({ filter: fileValidation.files }).single("subcategory"),
    validation(SubCategorySchemas.updateSubCategorySchema),
    subCategoryController.updateSubCategory)

//4 Update Category
router.delete("/delete-subcategory/:subCategoryId",
    isAuthenticated,isAuthorized("seller","admin"),
    validation(SubCategorySchemas.deleteSubCategorySchema),
    subCategoryController.deleteSubCategory)

export default router

