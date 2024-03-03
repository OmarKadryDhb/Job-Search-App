import express from 'express'
import { connectDB } from '././DB/connection.js'
import userRouter from './src/modules/user/user.router.js'
import categoryRouter from './src/modules/category/category.router.js'
import subCategoryRouter from './src/modules/subCategory/subCategory.router.js'
import brandRouter from './src/modules/brand/brand.router.js'
import couponRouter from './src/modules/coupon/coupon.router.js'
import productRouter from './src/modules/product/product.router.js'
import cartRouter from './src/modules/cart/cart.router.js'
import orderRouter from './src/modules/order/order.router.js'
import reviewRouter from './src/modules/review/review.router.js'

import dotenv from 'dotenv'

dotenv.config()
const app = express();
const port = process.env.PORT;

app.use(express.json())

await connectDB();

// users
app.use("/users",userRouter);
app.use("/category",categoryRouter);
app.use("/subcategory",subCategoryRouter);
app.use("/brand",brandRouter);
app.use("/coupon",couponRouter);
app.use("/product",productRouter);
app.use("/cart",cartRouter);
app.use("/order",orderRouter);
app.use("/review",reviewRouter);


// all
app.all("*",(req,res)=>{
    return res.json({
        success : false , 
        message : "Page Not Found !"
    })
})

// global error 
app.use((error , req , res , next)=>{
    return res.json({success : false 
    ,message: error.message
    ,stack: error.stack })
})

app.listen(port,() => console.log("App is running at port :",port))