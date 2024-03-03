import slugify from 'slugify';
import { Category } from '../../../DB/Models/category.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import cloudinary from './../../utils/cloud.js';
import { SubCategory } from '../../../DB/Models/subCategory.model.js';

// allCategories
export const allCategories = asyncHandler(async(req,res,next)=>{
    const category = await Category.find().populate("subcategory")

    return res.json({success : true , results:{category}})
})

// create Category
export const createCategory = asyncHandler(async(req,res,next)=>{
    if (!req.file) return next(new Error("Category Image is Required!,You Forgot to upload it"))

    const { public_id , secure_url } =  cloudinary.uploader.upload(
        req.file.path,
        {
            folder:`${process.env.CLOUD_FOLDER_NAME}/category/${req.body.categoryName}`
        }
    )
    
    const isCategory = await Category.findOne({categoryName:req.body.categoryName})
    if (isCategory) return next(new Error("This Category is Already Added!"))

    await Category.create({
        categoryName:req.body.categoryName ,
        slug:slugify(req.body.categoryName),
        createdBy:req.isUser._id,
        image:{ id:public_id , url:secure_url }
    })
    // TODO //problem in categoryimage in mongodb

    return res.json({success : true , message : "Category Created Successfully !"})
})

// update Category
export const updateCategory = asyncHandler(async(req,res,next)=>{
    const isCategory = await Category.findById(req.params.categoryId)
    if (!isCategory) return next (new Error("Category Not Found!"))

    if (req.isUser._id.toString() !== isCategory.createdBy.toString()) {
        return next(new Error("You Don't Have Permission!"))
    }

    if (req.file) {
        const { public_id , secure_url } =  cloudinary.uploader.upload(
            req.file.path,{ public_id:isCategory.image.id }
        )
        isCategory.image ={ id: public_id , url: secure_url}
    }

    isCategory.categoryName = req.body.categoryName ? req.body.categoryName : isCategory.categoryName
    isCategory.slug = req.body.categoryName ? slugify(req.body.categoryName) : isCategory.slug
    
    await isCategory.save()

    return res.json({success : true , message : "Category Updated Successfully !"})
})

// delete Category
export const deleteCategory = asyncHandler(async(req,res,next)=>{
    const isCategory = await Category.findById(req.params.categoryId)
    if (!isCategory) return next (new Error("Category Not Found!"))

    if (req.isUser._id.toString() !== isCategory.createdBy.toString()) {
        return next(new Error("You Don't Have Permission!"))
    }

    await isCategory.deleteOne()

    // const subCategories = await SubCategory.deleteMany({category:isCategory._id})

    await cloudinary.uploader.destroy(isCategory.image)

    return res.json({success : true , message : "Category Deleted Successfully !"})
})
