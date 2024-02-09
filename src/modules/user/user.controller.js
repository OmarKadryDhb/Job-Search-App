import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import bcryptjs from 'bcryptjs'
import  jwt  from 'jsonwebtoken';
import { Token } from '../../../DB/models/token.model.js';
import randomstring from 'randomstring'
import { sendEmails } from "../../utils/sendEmails.js";
import { Company } from "../../../DB/Models/company.model.js";

export const signUp = asyncHandler(async(req,res,next)=>{
    const isUser = await User.findOne({email:req.body.email})
    if (isUser) return next(new Error("Email Alredy Existed !"))
    
    const checkPhone = await User.findOne({mobileNumber:req.body.mobileNumber})
    if (checkPhone) return next(new Error("Mobile Number must Be Unique!"))

    const hashPass = bcryptjs.hashSync(req.body.password,parseInt(process.env.SALT_ROUND))
    
    const user = User.create({...req.body,password:hashPass,userName:req.body.firstName+req.body.lastName})

    const token = jwt.sign({email:user.email},process.env.SECRET_KEY)

    // const messageSent =  await sendEmails({to:req.body.email ,
    //     subject:"Account Activation" ,
    //     html:`<a href='http://localhost:3000/users/activateaccount/${token}'>Activate Your Account<a/>`})
    //   if (!messageSent) return next(new Error("Email is Invalid"))
  
    return res.json({success : true , message : "User Added Successfully !"})
})

// // Activate Account
// export const activateAccount = asyncHandler(async (req , res , next)=>{
//     const { token } = req.params
  
//     const payload = jwt.verify(token,process.env.SECRET_KEY)
      
//     const user = await User.findOneAndUpdate({email:payload.email},{new : true})
//     if (!user) return next(new Error("User Not Found!"))
  
//     return res.send("Try to login!")
// })
  
export const signIn = asyncHandler(async(req,res,next)=>{
    const isUser = await User.findOne({email:req.body.email})
    if (!isUser) return next(new Error("Email is Invalid !"))
    
    const match = bcryptjs.compareSync(req.body.password,isUser.password)
    if (!match) return next(new Error("Invalid Password !"))
    
    const token = jwt.sign({id:isUser._id,email:isUser.email},process.env.SECRET_KEY)

    await Token.create({token,user:isUser._id,agent:req.headers["user-agent"]})

    isUser.status = "online"
    await isUser.save()

    return res.json({success : true , message :"Welcome !" , token })
})

//Update User Account
export const updateAccount = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser._id

    await User.findByIdAndUpdate({_id:userId},{mobileNumber:req.body.mobileNumber,DOB:req.body.DOB},{new:true})

    return res.json({success : true , message :"User Updated Successfully !"})
})

//Delete User
export const deleteUser = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser.id

    // User must be loggedIn
    if (req.isUser.status != "online") return next(new Error("This User must be Loggedin First!"))

    if (req.isUser.role == "hr"){
        await Company.findOneAndDelete({companyHR:userId})
    }

    await User.findByIdAndDelete(userId)

    return res.json({success : true ,message :"User Deleted Successfully !"})
})

//getAccData
export const getAccData = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser._id

    const user = await User.find(userId)

    return res.json({success : true , result:user})
})

//getOntherAccData
export const getOntherAccData = asyncHandler(async(req,res,next)=>{
    const {id} = req.params

    const ontherUserAcc = await User.findById(id)
    if (!ontherUserAcc) return next(new Error("User Not Found"))

    return res.json({success : true , result:{
        firstName:ontherUserAcc.firstName,
        lastName:ontherUserAcc.lastName,
        userName:ontherUserAcc.userName,    
        DOB:ontherUserAcc.DOB,    
        mobileNumber:ontherUserAcc.mobileNumber,
        role:ontherUserAcc.role,    
        status:ontherUserAcc.status,    
    }})
})

//Update password 
export const updatePassword = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser.id

    const isUser = await User.findById(userId)

    const isMatch = bcryptjs.compareSync(req.body.oldPassword,isUser.password)
    if (!isMatch) return next(new Error("Invalid Password !"))
    
    const hashNewPass = bcryptjs.hashSync(req.body.newPassword,parseInt(process.env.SALT_ROUND))

    isUser.password = hashNewPass 
    await isUser.save()

    return res.json({success : true , message:"Password Updated Successfully!"})
})

/////
//Forget password 
export const forgetPassword = asyncHandler(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if (!user) return next (new Error("User Not Found !"))

    if (req.isUser.forgetPasswordCode !==  req.body.code) {
        return next(new Error("Invalid Code!")); 
    }
    
    user.password = bcryptjs.hashSync(req.body.password,parseInt(process.env.SALT_ROUND))
    await user.save()

    const tokens = await Token.find({user:user._id})
    tokens.forEach(async (token)=>{
    token.isValid = false
    await token.save()
    })

    return res.json({success : true , message:"Password Updated Successfully! , Try to Login.."})
})
// send Forget Code 
export const sendForgetPassCode = asyncHandler(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if (!user) return next (new Error("User Not Found !"))
    
    const code = randomstring.generate({
        length:6,
        charset:"numeric"
    })

    user.forgetPasswordCode = code
    await user.save() 

    const messageSent = await sendEmails({to:user.email, subject:"Resest Password" , html:`<div>${code}</div>`})
    if (!messageSent) return next(new Error("Email is Invalid"))

    return res.json({success : true , message:"Code Sent! , Check Your Email.."})
})
////

//getAllAccounts
export const getAllAccounts = asyncHandler(async(req,res,next)=>{
    const accounts = await User.find({recoveryEmail:req.body.recoveryEmail})

    return res.json({success : true , results:accounts})
})

