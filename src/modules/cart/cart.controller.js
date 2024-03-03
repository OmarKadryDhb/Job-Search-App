import { Cart } from '../../../DB/Models/cart.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { Product } from './../../../DB/Models/product.model.js';

// createProduct
export const addToCart = asyncHandler(async(req,res,next)=>{
    const {productId,quantity} = req.body
    
    const isProduct = await Product.findById(productId)
    if(!isProduct) return next(new Error("Product Not Found"))

    if (isProduct.inStock(quantity)) return next(new Error(`Only ${isProduct.availableItems} items are Available Now!`))

    const isProductInCart = await Cart.findOne({user:req.isUser._id,"products.productId":productId})
    if(!isProductInCart){
        const theProduct = isProductInCart.products.find(
            (prd)=>prd.productId.toString() === productId.toString()
        )
        if (isProduct.inStock(theProduct.quantity + quantity)) {
            theProduct.quantity = theProduct.quantity + quantity
            await isProductInCart.save()
            return res.json({success : true ,results:{cart:isProductInCart},
            })
        }else{
            return next(new Error(`Only ${isProduct.availableItems} items are Available Now!`))
        }
    }

    const cart = await Cart.findOneAndUpdate({user:req.isUser._id},
        {$push:{products:{productId , quantity}}},
        {new:true}
    )
    
    return res.json({success : true ,  
        message : "Product added Successfully !"
        ,results:{cart},
    })
})

// getUserCart
export const getUserCart = asyncHandler(async(req,res,next)=>{
    if (req.isUser.role == "user") {
        const cart = await Cart.findOne({user:req.isUser._id})
        return res.json({success : true , results:{cart}})
    }

    if (req.isUser.role && !req.body.cartId) return next(new Error("cart id is Required!"))

    const cart = await Cart.findById(req.body.cartId)
    return res.json({success : true , results:{cart}})
})

// getUserCart
export const updateUserCart = asyncHandler(async(req,res,next)=>{
    const {productId,quantity} = req.body
    
    const isProduct = await Product.findById(productId)
    if(!isProduct) return next(new Error("Product Not Found"))

    if (quantity > isProduct.availableItems ) return next(new Error(`Only ${isProduct.availableItems} items are Available Now!`))

    const cart = await Cart.findOneAndUpdate({
        user:req.isUser._id , 
        "products.productId":productId
    },{"products.$.quantity":quantity},
    {new:true})

    return res.json({success : true ,  
        message : "cart Updated Successfully !"
        ,results:{cart},
    })
})

// getUserCart
export const removeFromCart = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params
    
    const isProduct = await Product.findById(productId)
    if(!isProduct) return next(new Error("Product Not Found"))


    const cart = await Cart.findOneAndUpdate({user:req.isUser._id},
        {$pull:{products:{productId}}},
        {new:true}
    )

    return res.json({success : true ,  
        message : "items Removed from Cart Successfully !"
       ,results:{cart},
    })
})

// deleteProduct
export const clearCart = asyncHandler(async(req,res,next)=>{
    const cart = await Cart.findOneAndUpdate({user:req.isUser._id},
        {products:[]},
        {new:true}
    )

    return res.json({success : true , 
        message : "Cart Cleared Successfully !"
        ,results:{cart}})
})
