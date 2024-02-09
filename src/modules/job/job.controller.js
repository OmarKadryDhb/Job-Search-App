import { Application } from "../../../DB/Models/application.model.js"
import { Company } from "../../../DB/Models/company.model.js"
import { Job } from "../../../DB/Models/job.model.js"
import { User } from "../../../DB/models/user.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import cloudinary from './../../utils/cloud.js';

//1 add job
export const addJob = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser.id
    
    const isCompany = await Company.findOne({companyName:req.body.companyName})
    if (!isCompany) return next(new Error("Company Not Found"))

    if (userId.toString() !== isCompany.companyHR.toString()) {
        return next(new Error("Only The HR for this Company can Add Jobs!"))
    }

    await Job.create({...req.body,addedBy:isCompany.companyHR,companyId:isCompany._id})

    return res.json({success : true , message : "Job Added Successfully !"})
})

//2 update Job
export const updateJob = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser.id
    
    const isJob = await Job.findById(req.params.jobId)
    if (!isJob) return next(new Error("job Not Found"))

    const isCompany = await Company.findById(req.params.companyId)
    if (!isCompany) return next(new Error("Company Not Found"))

    if (userId.toString() !== isCompany.companyHR.toString()) {
        return next(new Error("Only The HR for this Company can Update Jobs!"))
    }

    isJob.seniorityLevel = req.body.seniorityLevel
    
    if (isJob.technicalSkills.includes(req.body.newTechnicalSkills)) {
        return next (new Error("This Skill is Already Added!"))
    }

    isJob.technicalSkills.push(...req.body.newTechnicalSkills) 
    await isJob.save()

    return res.json({success : true , message : "Job Updated Successfully !"})
})

//3 update Job
export const deleteJob = asyncHandler(async(req,res,next)=>{
    const userId = req.isUser.id
    
    const isCompany = await Company.findById(req.params.companyId)
    if (!isCompany) return next(new Error("Company Not Found"))

    if (userId.toString() !== isCompany.companyHR.toString()) {
        return next(new Error("Only The HR for this Company can Delete Jobs!"))
    }

    const isJob = await Job.findByIdAndDelete(req.params.jobId)
    if (!isJob) return next(new Error("job Not Found"))

    return res.json({success : true , message : "Job Deleted Successfully !"})

})

//4 getAllJobs
export const getAllJobs = asyncHandler(async(req,res,next)=>{
    const jobs = await Job.find().populate({
        path:"companyId"
    })
    return res.json({success : true ,result:jobs})
})

//5 getAllSpecificJob
export const getAllSpecificJob = asyncHandler(async(req,res,next)=>{
    const jobs = await Job.find({companyId:req.params.companyId}).populate({
        path:"companyId"
    })
    
    if (jobs.length == 0) return res.json({success : true ,message :"This company has no jobs Now!"})
    
    return res.json({success : true ,result:jobs})
})

//6 Get all Jobs that match the following filters 
export const getAllFiltersJobs = asyncHandler(async(req,res,next)=>{
    const isJob = await Job.find({
        $or:[{workingTime:req.body.workingTime},
        {jobLocation:req.body.jobLocation},
        {seniorityLevel:req.body.seniorityLevel},
        {jobTitle:req.body.jobTitle},
        {technicalSkills:req.body.technicalSkills}
    ]})

    return res.json({success : true ,result:isJob})
})

//7  Apply to Job 
export const applyJobs = asyncHandler(async(req,res,next)=>{
    const uId = req.isUser.id

    const isJob = await Job.findById(req.params.jobId)
    if (!isJob) return next(new Error("Job Not Found"))


    if (req.file == undefined) return next (new Error("Can not found File!"))

    const { secure_url , public_id } = await cloudinary.uploader
    .upload(req.file.path , {folder:`users/${uId}/applications`})
    
    await Application.create({...req.body,jobId:isJob._id,userId:uId,userResume:{secure_url,public_id}})

    return res.json({success : true  ,  message:"Application Added Successfully!"})
})
