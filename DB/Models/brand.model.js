import mongoose,{Schema, Types} from 'mongoose'

const brandSchema = new Schema ({
    brandName:{type:String  , unique:true , required:true},
    slug:{type:String , unique:true , required:true},
    createdBy:{type:Types.ObjectId , ref :"users",required:true},
    image:{url: {type:String},id:{type:String}},
    category:{type:Types.ObjectId , ref :"category"}
    
},{timestamps:true})

export const Brand = mongoose.model("brand", brandSchema);

