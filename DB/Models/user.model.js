import mongoose,{Schema} from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = new Schema ({
    userName:{type:String},
    email:{type:String ,lowercase: true, unique:true , required:true},
    password:{type:String , required:true},
    confirmPassword:{type:String , required:true},
    isConfirmed:{type:Boolean ,default:false, required:true},
    forgetPasswordCode:{type:String},
    gender:{type:String,enum:["Male","Female"],required:true},
    phone:{type:String , unique:true},
    role:{type:String , enum:["user","seller","admin"],default:"user"},
    profilePicture:{
        url: {type:String , default:"https://res.cloudinary.com/dzfhkhn8h/image/upload/v1708301515/ecommerce/users/defaults/profilePic/default-profile-picture_gvkjkm.webp"} 
    ,   id:  {type:String , default:"ecommerce/users/defaults/profilePic/default-profile-picture_gvkjkm"}
    },
    coverImages:[{ url: {type:String} ,id: {type:String} }]
},{timestamps:true})    

userSchema.pre("save",function(){
    if(this.isModified("password")){
        this.password = bcryptjs.hashSync(this.password,parseInt(process.env.SALT_ROUND))
    }
}) 

export const User = mongoose.model("users", userSchema);