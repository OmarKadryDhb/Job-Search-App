import {Router} from 'express'
import * as couponController from './coupon.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as CouponSchemas from './coupon.schema.js'
import { isAuthorized } from './../../middleware/authorization.middleware.js';
import { fileValidation, uploadFileCloud } from '../../utils/multer.js'

const router = Router()


//1 All Coupon
router.get("/",isAuthenticated,isAuthorized("seller","admin"),
couponController.allCoupons)

//2 Create Coupon
router.post("/create-coupon",
    isAuthenticated,isAuthorized("seller"),
    uploadFileCloud({ filter: fileValidation.files }).single("coupon"),
    validation(CouponSchemas.createCouponSchema),
    couponController.createCoupon)

//3 Update coupon
router.patch("/update-coupon/:couponCode",
    isAuthenticated,isAuthorized("seller"),
    uploadFileCloud({ filter: fileValidation.files }).single("coupon"),
    validation(CouponSchemas.updateCouponSchema),
    couponController.updateCoupon)

//4 Update coupon
router.delete("/delete-coupon/:couponCode",
    isAuthenticated,isAuthorized("seller"),
    validation(CouponSchemas.deleteCouponSchema),
    couponController.deleteCoupon)

export default router

