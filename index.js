import express from 'express'
import { connectDB } from '././DB/connection.js'
import userRouter from './src/modules/user/user.router.js'
import companyRouter from './src/modules/company/company.router.js'
import jobRouter from './src/modules/job/job.router.js'
// import appRouter from './src/modules/application/application.router.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express();
const port = process.env.PORT;

app.use(express.json())

await connectDB();

// users
app.use("/users",userRouter);
app.use("/company",companyRouter);
app.use("/job",jobRouter);
// app.use("/applications",appRouter);


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