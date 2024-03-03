import mongoose,{Schema, Types} from 'mongoose'

const subCategorySchema = new Schema ({
    subCategoryName:{type:String ,lowercase:true , unique:true , required:true},
    slug:{type:String , unique:true , required:true},
    createdBy:{type:Types.ObjectId , ref :"users",required:true},
    image:{url: {type:String},id:{type:String}},
    category:{type:Types.ObjectId , ref :"category",required:true},
    brand:[{type:Types.ObjectId , ref :"brand"}]
},{timestamps:true})

export const SubCategory = mongoose.model("subCategory", subCategorySchema);

