import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/Models/category.model.js";
import cloudinary from "../../utils/cloud.js";
import { Brand } from "../../../DB/Models/brand.model.js";
import slugify from "slugify";

// addBrand
export const addBrand = asyncHandler(async(req,res,next)=>{
    const {categories} = req.body

    categories.forEach(async(categoryId) => {
        const isCategory = await Category.findById(categoryId)
        if (!isCategory) return next(new Error(`Category "${categoryId}" Not Found!`))
    });

    if (!req.file) return next(new Error("Brand Image is Required!,You Forgot to upload it"))

    const { public_id , secure_url } =  cloudinary.uploader.upload(
        req.file.path,
        {
            folder:`${process.env.CLOUD_FOLDER_NAME}/brand/${req.body.brandName}`
        }
    )
    
    const isBrandExsits = await Brand.findOne({brandName:req.body.brandName})
    if (isBrandExsits) return next(new Error("This Brand is Already Added!"))

    const isBrand = await Brand.create({
        brandName:req.body.brandName ,
        slug:slugify(req.body.brandName),
        createdBy:req.isUser._id,
        image:{ id:public_id , url:secure_url }
    })

    categories.forEach(async(categoryId) => {
        const isCategory = await Category.findByIdAndUpdate(categoryId,
            {$push:{brand:isBrand._id}})
    });

    return res.json({success : true , message : "Brand Added Successfully !"})
})

// update
export const updateBrand = asyncHandler(async(req,res,next)=>{
    const isBrand = await Brand.findById(req.params.brandId)
    if (!isBrand) return next(new Error("Brand Not Found!"))

    if (req.file) {
    const { public_id , secure_url } =  cloudinary.uploader.upload(
        isBrand.image.id
    )
    isBrand.image={url: secure_url , id:public_id}
    }

    isBrand.brandName = req.body.brandName ? req.body.brandName : isBrand.brandName
    isBrand.slug = req.body.brandName ? slugify(req.body.brandName) : isBrand.slug
    
    await isBrand.save()

    return res.json({success : true , message : "Brand Updated Successfully !"})
})

// delete
export const deleteBrand = asyncHandler(async(req,res,next)=>{
    const isBrand = await Brand.findByIdAndDelete(req.params.brandId)
    if (!isBrand) return next(new Error("Brand Not Found!"))

    await cloudinary.uploader.destroy(isBrand.image)

    await Category.updateMany({},{$pull:{brand:isBrand._id}})

    return res.json({success : true , message : "Brand Deleted Successfully !"})
})

// allBrands
export const allBrands = asyncHandler(async(req,res,next)=>{
    const brands = await Brand.find()
    return res.json({success : true , results:{brands}})
    
})