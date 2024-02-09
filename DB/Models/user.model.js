import mongoose,{Schema} from 'mongoose'

const userSchema = new Schema ({
    firstName:{type:String , required:true},
    lastName:{type:String  , required:true},
    userName:{type:String},
    email:{type:String , unique:true , required:true},
    password:{type:String , required:true},
    forgetPasswordCode:{type:String},
    recoveryEmail:{type:String , unique:false , required:true},
    DOB:{type:Date}, //TODO //Date Format
    mobileNumber:{type:String , unique:true},
    role:{type:String , enum:["user","hr"],default:"user"},
    status:{type:String , enum:["online","offline"],default:"offline"}, 
},{timestamps:true})

export const User = mongoose.model("users", userSchema);