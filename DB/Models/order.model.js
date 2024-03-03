import mongoose,{Schema, Types} from 'mongoose'

const orderSchema = new Schema ({
    user:{type:Types.ObjectId ,ref:"user", required:true},
    products:[
        {
            productId:{type:Types.ObjectId,ref:"product"},
            quantity:{type:Number  ,min:1},
            name:String,
            itemPrice:Number,
            totalPrice:Number
        },
    ],
    address:{type:String , required:true},
    payment:{type:String ,enum:["cash","visa"],default:"cash", required:true},
    phone:{type:String , required:true},
    price:{type:Number , required:true},
    coupon:{
        id:{type:Types.ObjectId,ref:"coupon"},
        couponName:String ,
        discount:{type:Number , min:1 , max :100}
    },
    status:{type:String ,enum:["placed","shipped","delivered","canceled","refunded"],default:"placed", required:true},
},{timestamps:true , toJSON:{virtuals:true},strictQuery:true})


orderSchema.virtual("finalPrice").get(function(){
    return Number.parseFloat(
        this.price - (this.price * this.coupon.discount || 0)/100).toFixed(2)
})

export const Order = mongoose.model("order", orderSchema);

