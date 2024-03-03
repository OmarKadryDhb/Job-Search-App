import Stripe from 'stripe';
import { Cart } from '../../../DB/Models/cart.model.js';
import { Coupon } from '../../../DB/Models/coupon.model.js';
import { Order } from '../../../DB/Models/order.model.js';
import { Product } from '../../../DB/Models/product.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { clearCart, updateStock } from './order.service.js';

// allCategories
export const createOrder = asyncHandler(async(req,res,next)=>{
    const {payment , address , coupon, phone } = req.body

    let checkCoupon
    if (coupon) {
        checkCoupon = await Coupon.findOne({couponName:coupon,expiredAt:{$gt:Date.now()}})
    }

    if (!checkCoupon) return next (new Error("Invalid Coupon!"))

    const cart = await Cart.findOne({user:req.isUser._id})
    const products = cart.products
    if(products.length<1) return next(new Error("Empty Cart!"))

    let orderProducts = []
    let orderPrice = 0

    for (let i = 0; i < products.length; i++) {
        const product = await Product.find(products[i].productId);
        if (!product) return next (new Error(`${products[i].productId} product not Found!`))

        if (!product.inStock(products[i].quantity)) return next (new Error(`Product out Stock , only${product.availableItems} are available!`))

        orderProducts.push({
            productName : product.productName,
            quantity:products[i].quantity,
            itemPrice:product.finalPrice,
            totalPrice:product.finalPrice * products[i].quantity,
            productId:product._id
        })
        orderPrice += product.finalPrice * products[i].quantity
    }
    
    const order = await Order.create({
        user:req.isUser._id,
        address,
        phone,
        payment,
        products:orderProducts,
        price:orderPrice,
        coupon:{
            id:checkCoupon?._id,
            couponName:checkCoupon?.couponName,
            discount:checkCoupon?.discount,
        }
    })
    
    updateStock(order.products,true)

    clearCart(req.isUser._id)

    if (payment === "visa") {
        const stripe = new Stripe (process.env.STRIPE_KEY)
        
        //create coupon 
        let couponExited
        if(order.coupon.couponName !== undefined){
            couponExited = await stripe.coupons.create({
                percent_off: order.coupon.discount,
                duration:"once"
            }) 
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            // success_url:,
            // cancel_url:,
            line_items:order.products.map((prd)=>{
                return {price_data: {currency:"egp" , 
                product_data:{name:prd.name , 
                    // images:[prd.productId.]
                },unit_amount:prd.itemPrice * 100} , 
                quantity:prd.quantity
            }}),
            discounts: couponExited ? [{coupon: couponExited.id}] :[]
        })

        return res.json({success : true , results:{url:session.url}})
    }

    return res.json({success : true , results:{order}})
})

// cancel 
export const cancelOrder = asyncHandler(async(req,res,next)=>{
    const isOrder = await Order.findById(req.params.orderId)
    if(!isOrder) return next (new Error("Order Not Found"))

    if (!isOrder.status === "placed") return next(new Error("can not Cancel The Order!"))

    isOrder.status = "canceled"
    await isOrder.save()

    updateStock(isOrder.products,false)

    return res.json({success : true , message:"Order Canceld Successfully!"})
})
