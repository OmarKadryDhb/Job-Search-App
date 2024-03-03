import {Router} from 'express'
import * as categoryController from './category.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as CategorySchemas from './category.schema.js'
import { isAuthorized } from './../../middleware/authorization.middleware.js';
import { fileValidation, uploadFileCloud } from '../../utils/multer.js'
import subCategoryRouter from './../subCategory/subCategory.router.js'

const router = Router()

router.use("/:categoryId/subcategory",subCategoryRouter)

//1 All Categories
router.get("/",isAuthenticated,isAuthorized("admin"),
    categoryController.allCategories)

//2 Create Category
router.post("/create-category",
    isAuthenticated,isAuthorized("seller","admin"),
    uploadFileCloud({ filter: fileValidation.files }).single("category"),
    validation(CategorySchemas.createCategorySchema),
    categoryController.createCategory)

//3 Update Category
router.patch("/update-category/:categoryId",
    isAuthenticated,isAuthorized("seller","admin"),
    uploadFileCloud({ filter: fileValidation.files }).single("category"),
    validation(CategorySchemas.updateCategorySchema),
    categoryController.updateCategory)

//4 Update Category
router.delete("/delete-category/:categoryId",
    isAuthenticated,isAuthorized("seller","admin"),
    validation(CategorySchemas.deleteCategorySchema),
    categoryController.deleteCategory)

export default router

