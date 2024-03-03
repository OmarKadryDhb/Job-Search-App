import mongoose,{Schema, Types} from 'mongoose'

const productSchema = new Schema ({
    productName:{type:String  ,min:7,max:30, unique:true , required:true},
    discription:{type:String,min:10,max:100,required:true},
    images:
    [{ 
        url: {type:String,required:true} ,
        id: {type:String,required:true} 
    }],
    defaultImages:{
        id: {type:String,required:true},
        url: {type:String,required:true}
    },
    availableItems:{type:Number , min:1,required:true},
    soldItems:{type:Number ,default:0},
    price:{type:Number,min:1,required:true},
    discount:{type:Number,min:1,max:100},
    createdBy:{type:Types.ObjectId , ref :"users",required:true},
    category:{type:Types.ObjectId , ref :"category"},
    subCategory:{type:Types.ObjectId , ref :"subCategory"},
    brand:{type:Types.ObjectId , ref :"brand"},
    cloudFolder:{type:String,unique:true,required:true},
    averageRate:{type:Number,min:1,max:5}
},{timestamps:true , toJSON:{virtuals:true},strictQuery:true})

productSchema.virtual("finalPrice").get(function(){
    return Number.parseFloat(
        this.price - (this.price * this.discount || 0)/100).toFixed(2)
})

productSchema.virtual("review",{
    ref:"review",
    localField:"_id",
    foreignField:"productId"
})


productSchema.query.paginate = function(page){
    page = page < 1 || isNaN(page) || !page? 1:page
    const limit = 2
    const skip = limit * (page - 1)

    return this.skip(skip).limit(limit)
}

productSchema.methods.inStock = function(requiredQuantity){

    return this.availableItems >= requiredQuantity ? true : false
}

productSchema.query.search = function(keyword){
    if (keyword) {
       return this.find({
        $or:[
            {productName:{$regex:keyword,$options:"i"}},
            {discription:{$regex:keyword,$options:"i"}}
        ]    
    })
    }
    return this
}


productSchema.post("deleteOne",{
    document:true,
    query:false
    },
    async function () {
        const ids=this.images.map((image)=>image.id)
        ids.push(this.defaultImages.id)

        await cloudinary.api.delete_resources(ids)

        await cloudinary.api.delete_folder(`${process.env.CLOUD_FOLDER_NAME}/products/${isProduct.cloudFolder}`)
}
)

export const Product = mongoose.model("product", productSchema);

