import mongoose,{Schema, Types} from 'mongoose' 

const jobSchema = new Schema ({
    jobTitle:{type:String, required:true},
    jobLocation:{type:String, enum:["onsite","remotely","hybrid"],required:true},
    workingTime:{type:String,enum:["part-time","full-time"] ,required:true},
    seniorityLevel:{type:String, enum:["Junior","Mid-Level","Senior","Team-Lead","CTO"],required:true},
    jobDescription:{type:String,required:true},
    technicalSkills:[{type:String,required:true}],
    softSkills:[{type:String,required:true}],
    addedBy:{type:Types.ObjectId , ref :"users",require:true},
    companyId:{type:Types.ObjectId , ref :"company",require:true}
},{timestamps:true,toJSON:{virtuals:true}})

jobSchema.virtual("appId",{
    ref:"app",
    localField:"_id", //app primaryKey
    foreignField:"jobId" //jobSchema
})

export const Job = mongoose.model("job",jobSchema);