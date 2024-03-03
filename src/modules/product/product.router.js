import {Router} from 'express'
import * as productController from './product.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as ProductSchemas from './product.schema.js'
import { isAuthorized } from './../../middleware/authorization.middleware.js';
import { fileValidation, uploadFileCloud } from '../../utils/multer.js'
import  reviewRouter from './../review/review.router.js'

const router = Router()

router.use("/:productId/review",reviewRouter)

//1 All products
router.get("/",
productController.allProducts)

//2 Create product
router.post("/create-product",
    isAuthenticated,isAuthorized("seller","admin"),
    uploadFileCloud({ filter: fileValidation.files }).
    fields([
        {name:"defaultImages",maxCount:1},
        {name:"subImages",maxCount:3}]),
    validation(ProductSchemas.createProductSchema),
    productController.createProduct)

//3 Update product
router.patch("/update-product/:productId",
    isAuthenticated,isAuthorized("seller"),
    uploadFileCloud({ filter: fileValidation.files }).single("product"),
    validation(ProductSchemas.updateProductSchema),
    productController.updateProduct)

//4 Update product
router.delete("/delete-product/:productId",
    isAuthenticated,isAuthorized("seller"),
    validation(ProductSchemas.deleteProductSchema),
    productController.deleteProduct)

export default router

