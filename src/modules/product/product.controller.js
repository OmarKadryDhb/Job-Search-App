import { Category } from '../../../DB/Models/category.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import cloudinary from './../../utils/cloud.js';
import { nanoid } from 'nanoid';
import { Product } from '../../../DB/Models/product.model.js';
import { SubCategory } from './../../../DB/Models/subCategory.model.js';
import { Brand } from '../../../DB/Models/brand.model.js';

// allCategories
export const allProducts = asyncHandler(async(req,res,next)=>{
    const {sort , page , keyword , category , brand , SubCategory} = req.query
    if (category && !(await Category.findById(category)))
        return next(new Error("Category Not Found!"))

    if (brand && !(await Brand.findById(brand)))
        return next(new Error("Brand Not Found!"))
    
    if (SubCategory && !(await SubCategory.findById(SubCategory)))
        return next(new Error("subCategory Not Found!"))
    
    const results = await Product.find({...req.query}).
    sort(sort).paginate(page).search(keyword)

    return res.json({success : true , results})
})

// createProduct
export const createProduct = asyncHandler(async(req,res,next)=>{
    const isCategory = await Category.findById(req.body.categoryId)
    if (!isCategory) return next(new Error("Category Not Found"))

    const isSubCategory = await SubCategory.findById(req.body.subcategoryId)
    if (!isSubCategory) return next(new Error("SubCategory Not Found"))

    const isBrand = await Brand.findById(req.body.brandId)
    if (!isBrand) return next(new Error("Brand Not Found"))


    if (!req.files) return next(new Error("Product Image is Required!,You Forgot to upload it"))

    // createFolder
    const cloudFolder = nanoid()

    let images = []
    for(const file of  req.files.subImages){
        const { public_id , secure_url } = await cloudinary.uploader.upload(
            file.   path,
            {
                folder:`${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}/subImages`
            }
        )
        images.push({id:public_id , url:secure_url})
    }

    const { public_id , secure_url } = await cloudinary.uploader.upload(
        req.files.defaultImages[0].path,
        {
            folder:`${process.env.CLOUD_FOLDER_NAME}/produts/${cloudFolder}/defaultImages`
        }
    )

    const product = await Product.create({
        ...req.body,
        cloudFolder,
        defaultImages:{url:secure_url , id:public_id},
        images,
        createdBy:req.isUser._id
    })

    return res.json({success : true , message : "Product Created Successfully !"})
})

// updateProduct
export const updateProduct = asyncHandler(async(req,res,next)=>{

    return res.json({success : true , message : "Product Updated Successfully !"})
})

// deleteProduct
export const deleteProduct = asyncHandler(async(req,res,next)=>{
    const isProduct = await Product.findById(req.params.productId)
    if (!isProduct) return next(new Error("Category Not Found"))

    if (req.isUser._id.toString() !== isProduct.createdBy.toString()) {
        return next(new Error("You Don't Have Permisions!"))
    }

    await isProduct.deleteOne()

    return res.json({success : true , message : "Product Deleted Successfully !"})
})
