import { Cart } from '../../../DB/Models/cart.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Product } from './../../../DB/Models/product.model.js';
import { Order } from './../../../DB/Models/order.model.js';
import { Review } from '../../../DB/Models/review.model.js';

// createProduct
export const addReview = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params.productId
    const {comment , rating} = req.body

    const order = await Order.findOne({
        user:req.isUser._id,status:"delivered",
        "products.productId":productId
    })
    if(!order) return next(new Error("Can Not Review This Product!"))

    if(await Review.findOne({createdBy:req.isUser._id,productId,orderId:order._id}))
     return next (new Error("You Already Added Your Review"))

    const review = await Review.create({
        comment,
        rating,
        createdBy:req.isUser._id,
        orderId:order._id,
        productId
    })

    let calcRating =0
    const product =  await Product.findById(productId)
    const reviews =  await Review.find({productId})

    for (let i = 0; i < reviews.length; i++) {
        calcRating += reviews[i].rating
    }

    product.averageRate = calcRating / reviews.length
    await product.save()

    return res.json({success : true ,message : "Review added Successfully !",results:{review}})
})

// createProduct
export const updateReview = asyncHandler(async(req,res,next)=>{
    const {reviewId , productId} = req.params

    await Review.updateOne({_id:reviewId,productId},{...req.body})

    if(req.body.rating){
        let calcRating =0
        const product =  await Product.findById(productId)
        const reviews =  await Review.find({productId})

        for (let i = 0; i < reviews.length; i++) {
        calcRating += reviews[i].rating
        }

        product.averageRate = calcRating / reviews.length
        await product.save()
    }

    return res.json({success : true ,message : "Your Review Updated Successfully !",results:{review}})
})