import multer , {diskStorage} from 'multer'

export const fileValidation = {
    files:["application/pdf"]
}
// Cloud
export function uploadFileCloud({filter}){

    const storage = diskStorage({})
    
    const fileFilter = (req, file ,cb)=>{
        if (!filter.includes(file.mimetype)) {
           return cb(new Error("Invalid format , file must be pdf!"),false) 
        }
        return cb(null,true)
    }

    const multerUpload = multer({storage , fileFilter})
    
    return multerUpload
}