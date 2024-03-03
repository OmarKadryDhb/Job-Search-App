import mongoose,{Schema, Types} from 'mongoose'
import { SubCategory } from './subCategory.model.js'

const categorySchema = new Schema ({
    categoryName:{type:String , unique:true , required:true},
    slug:{type:String , unique:true , required:true},
    createdBy:{type:Types.ObjectId , ref :"users"},
    image:{url: {type:String},id:{type:String}},
    brand:[{type:Types.ObjectId , ref :"brand"}]
},{timestamps:true  , toJSON:{virtuals:true} })

categorySchema.virtual("subcategory",{
    ref:"subCategory",
    localField:"_id",
    foreignField:"category"
})

categorySchema.post("deleteOne",{
    document:true,
    query:false},
    async function () {
        await SubCategory.deleteMany({category:this._id})
    }
)


export const Category = mongoose.model("category", categorySchema);