import mongoose,{Schema, Types} from 'mongoose'

const reviewSchema = new Schema ({
    rating:{type:Number , required:true , min:1 , max :5},
    comment:{type:String },
    createdBy:{type:Types.ObjectId,ref:"users",required:true},
    productId:{type:Types.ObjectId,ref:"product",required:true},
    orderId:{type:Types.ObjectId,ref:"order",required:true},
},{timestamps:true , toJSON:{virtuals:true}})

export const Review = mongoose.model("review", reviewSchema);

