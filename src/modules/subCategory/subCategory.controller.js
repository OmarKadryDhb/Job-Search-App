import slugify from "slugify";
import { Category } from "../../../DB/Models/category.model.js";
import { SubCategory } from "../../../DB/Models/subCategory.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

// allCategories
export const allSubCategories = asyncHandler(async(req,res,next)=>{
    if (req.params.categoryId !== undefined) {
        const isCategory = await Category.findById(req.params.categoryId)
        if (!isCategory) return next (new Error("Category Not Found!"))
    
        const results = await SubCategory.find({category:req.params.categoryId})
        return res.json({success : true , results})
    }

    const subcategory = await SubCategory.find().populate([
        {path:"category" , select:"categoryName -_id" , populate:{path:"createdBy"}},
        {path:"createdBy" , select:"userName role -_id"},
    ])

    return res.json({success : true , results:{subcategory}})
})

// create Category
export const createSubCategory = asyncHandler(async(req,res,next)=>{
    const isCategory = await Category.findById(req.params.categoryId)
    if (!isCategory) return next (new Error("Category Not Found!"))

    if (!req.file) return next(new Error("SubCategory Image is Required!,You Forgot to upload it"))

    const { public_id , secure_url } =  cloudinary.uploader.upload(
        req.file.path,
        {
            folder:`${process.env.CLOUD_FOLDER_NAME}/category/${isCategory.categoryName}/subCategory/${req.body.subCategoryName}`
        }
    )
    
    const isSubCategory = await SubCategory.findOne({subCategoryName:req.body.subCategoryName})
    if (isSubCategory) return next(new Error("This Category is Already Added!"))

    await SubCategory.create({
        subCategoryName:req.body.subCategoryName ,
        slug:slugify(req.body.subCategoryName),
        createdBy:req.isUser._id,
        image:{ id:public_id , url:secure_url },
        category:req.params.categoryId
    })
    // TODO //problem in categoryimage in mongodb

    return res.json({success : true , message : "Subcategory Created Successfully !"})
})

// update Category
export const updateSubCategory = asyncHandler(async(req,res,next)=>{
    const isCategory = await Category.findById(req.params.categoryId)
    if (!isCategory) return next (new Error("Category Not Found!"))

    const isSubCategory = await SubCategory.findOne({_id:req.params.subCategoryId , category: req.params.categoryId})
    if (!isSubCategory) return next (new Error("subCategory Not Found!"))

    if (req.isUser._id.toString() !== isSubCategory.createdBy.toString()) {
        return next(new Error("You Don't Have Permission!"))
    }

    if (req.file) {
        const { public_id , secure_url } =  cloudinary.uploader.upload(
            req.file.path,
            { public_id:isSubCategory.image.id }
        )
        isSubCategory.image ={ id: public_id , url: secure_url}
    }

    isSubCategory.subCategoryName = req.body.subCategoryName ? req.body.subCategoryName : isSubCategory.subCategoryName
    isSubCategory.slug = req.body.subCategoryName ? slugify(req.body.subCategoryName) : isSubCategory.slug
    
    await isSubCategory.save()

    return res.json({success : true , message : "Category Updated Successfully !"})
})

// delete Category
export const deleteSubCategory = asyncHandler(async(req,res,next)=>{
    const isCategory = await Category.findById(req.params.categoryId)
    if (!isCategory) return next (new Error("Category Not Found!"))

    const isSubCategory = await SubCategory.findOne({ _id:req.params.subCategoryId , category: req.params.categoryId})
    if (!isSubCategory) return next (new Error("subCategory Not Found!"))

    if (req.isUser._id.toString() !== isSubCategory.createdBy.toString()) {
        return next(new Error("You Don't Have Permission!"))
    }

    await SubCategory.findByIdAndDelete(req.params.subCategoryId)

    await cloudinary.uploader.destroy(isSubCategory.image)

    return res.json({success : true , message : "Category Deleted Successfully !"})
})
