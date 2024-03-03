import mongoose,{Schema, Types} from 'mongoose'

const cartSchema = new Schema ({
    products:[
        {
            productId:{type:Types.ObjectId,ref:"product"},
            quantity:{type:Number  ,default:1},
        },
    ],
    user:{type:Types.ObjectId,ref:"users",required:true , unique:true},
},{timestamps:true , toJSON:{virtuals:true},strictQuery:true})

export const Cart = mongoose.model("cart", cartSchema);

