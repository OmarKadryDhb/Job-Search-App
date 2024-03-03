import mongoose,{Schema, Types} from 'mongoose'

const couponSchema = new Schema ({
    couponName:{type:String  , unique:true , required:true},
    discount:{type:Number,min:1,max:100,required:true},
    expiredAt:{type:Number,required:true},
    createdBy:{type:Types.ObjectId , ref :"users",required:true},
},{timestamps:true})

export const Coupon = mongoose.model("coupon", couponSchema);

