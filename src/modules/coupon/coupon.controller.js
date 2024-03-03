import { asyncHandler } from '../../utils/asyncHandler.js';
import randomstring from 'randomstring'
import { Coupon } from './../../../DB/Models/coupon.model.js';

// allCategories
export const allCoupons = asyncHandler(async(req,res,next)=>{
    if (req.isUser.role === "admin") {
        const coupons = await Coupon.find()
        return res.json({success : true , results:{coupons}})
    }

    const sellerCoupons = await Coupon.find({createdBy:req.isUser._id})
    return res.json({success : true , results:sellerCoupons})
})

// create Category
export const createCoupon = asyncHandler(async(req,res,next)=>{
    const couponCode = randomstring.generate({
        length:6,
    })

    const coupon = await Coupon.create({
        couponName:couponCode,
        discount:req.body.discount,
        expiredAt:new Date(req.body.expiredAt).getTime(),
        createdBy:req.isUser._id
    })

    return res.json({success : true , message : "Coupon Created Successfully !" , result: {coupon}})
})

// update Category
export const updateCoupon = asyncHandler(async(req,res,next)=>{
    const isCoupon =await Coupon.findOne({couponName:req.params.couponCode , expiredAt:{$gt:Date.now()}})
    if(!isCoupon) return next (new Error("Invalid Coupon!"))

    if (req.isUser._id.toString() !== isCoupon.createdBy.toString()) {
        return next(new Error("You Don't Have Permission!"))
    }

    isCoupon.discount = req.body.discount ? req.body.discount : isCoupon.discount
    isCoupon.expiredAt = req.body.expiredAt ? new Date(req.body.expiredAt).getTime() : isCoupon.expiredAt
    await isCoupon.save()

    return res.json({success : true , message : "Coupon Updated Successfully !"})
})

// delete Category
export const deleteCoupon = asyncHandler(async(req,res,next)=>{
    const isCoupon = await Coupon.findOne({couponName:req.params.couponCode})
    if(!isCoupon) return next (new Error("Coupon Not Found!"))

    if (req.isUser._id.toString() !== isCoupon.createdBy.toString()) {
        return next(new Error("You Don't Have Permission!"))
    }

    await isCoupon.deleteOne()

    return res.json({success : true , message : "Coupon Deleted Successfully !"})
})
