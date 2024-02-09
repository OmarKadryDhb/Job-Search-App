import mongoose,{Schema, Types} from 'mongoose'

const companySchema = new Schema({
    companyName:{type:String,unique:true,required:true},
    description:{type:String,required:true},
    industry:{type:String,required:true},
    address:{type:String},
    numberOfEmployees:{type:Number, min:11 , max:25 , required:true},
    companyEmail:{type:String,unique:true},
    companyHR:{type:Types.ObjectId , ref :"users"}
},
{timestamps:true , toJSON :{virtuals:true}, toObject:{virtuals:true}})


// job
companySchema.virtual("jobId",{
    ref:"job",
    localField:"_id", //company primaryKey
    foreignField:"companyId" //jobSchema
})
export const Company = mongoose.model("company",companySchema)