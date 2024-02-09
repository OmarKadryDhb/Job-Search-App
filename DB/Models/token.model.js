import mongoose,{Schema, Types} from 'mongoose'

const tokenSchema = new Schema({
   token:{type:String , require:true},
   user:{type:Types.ObjectId, ref:"users",require:true},
   isValid:{type:Boolean , default:true},
   agent:{type:String} ,
},{timestamps:true})

export const Token = mongoose.model('token',tokenSchema);