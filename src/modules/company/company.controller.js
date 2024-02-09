import { Company } from "../../../DB/Models/company.model.js";
import { Job } from "../../../DB/Models/job.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

//1 addCompany
export const addCompany = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser._id

    if (req.isUser.role != "hr") return next(new Error("You dont Have Permission!")) 

    await Company.create({...req.body,companyHR:userId})

    return res.json({success : true , message : "Company Added Successfully !"})
})

//2 Update company data 
export const UpdateCompanyData = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser.id

    const isCompany = await Company.findById(req.params.companyId)
    if (!isCompany) return next(new Error("Company Not Found!"))
    
    if (isCompany.companyHR.toString() !== userId.toString()){
        return next(new Error("You're Not the CompanyHR"))
    } 

    isCompany.numberOfEmployees = req.body.newNumberOfEmployees
    await isCompany.save()

    return res.json({success : true , message :"Company Updated Successfully !"})
})

//3 Delete Company
export const deleteCompanyData = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser.id

    const isCompany = await Company.findById(req.params.companyId)
    if (!isCompany) return next(new Error("Company Not Found!"))
    
    if (isCompany.companyHR.toString() !== userId.toString()){
        return next(new Error("You're Not the CompanyHR"))
    }
    
    // User must be loggedIn
    if (req.isUser.status != "online") return next(new Error("This User must be Loggedin First!"))

    await Company.findByIdAndDelete(req.body.companyId)

    return res.json({success : true ,message :"Company Deleted Successfully !"})
})

//4 get Company
export const getCompany = asyncHandler(async(req,res,next)=>{
    const isCompany = await Company.findById(req.params.companyId).populate("jobId")
    if (!isCompany) return next(new Error("Company Not Found!"))

    return res.json({success : true ,result:isCompany})
})

//5 Search for a Company using Name
export const searchCompany = asyncHandler(async(req,res,next)=>{
    const isCompany = await Company.findOne({companyName:req.body.companyName})
    if (!isCompany) return next(new Error("Company Not Found!"))

    return res.json({success : true ,result:{
        companyName:isCompany.companyName,
        industry:isCompany.industry        
    }})
})

//6 getAllSpecificApplications  
export const getAllSpecificApplications = asyncHandler(async(req,res,next)=>{
    const uId = req.isUser.id

    const isCompany = await Company.findById(req.params.companyId)
    if (!isCompany) return next (new Error("Company not Found"))

    if (uId.toString() !== isCompany.companyHR.toString()) {
        return next(new Error("Only the HR for This Company can do This Action!"))
    } 

    const isJob = await Job.findById(req.params.jobId).populate({
        path:"appId",
        select: "- userId"
    })

    if (req.params.companyId !== isJob.companyId.toString()){ 
        return next (new Error("This company has no like this job!"))
    }
    return res.json({success : true ,result:isJob})
})
