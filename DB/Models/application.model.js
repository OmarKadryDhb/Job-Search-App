import mongoose,{Schema, Types} from 'mongoose'

const appSchema = new Schema ({
    jobId:{type:Types.ObjectId , ref :"job",require:true},
    userId:{type:Types.ObjectId , ref :"users",require:true},
    userTechSkills:{type:Array,required:true},
    userSoftSkills:{type:Array,required:true},
    userResume:[{secure_url:String , public_id:String}]
})


export const Application = mongoose.model("app",appSchema)