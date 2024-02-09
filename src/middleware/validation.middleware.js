import {Types} from 'mongoose'

export const validation = (schema)=>{
    return (req, res ,next) =>{
        const data = {...req.params, ...req.body , ...req.query}

        const validateResult = schema.validate(data,{abortEarly:false})

        if (validateResult.error) {
            const errorMessages = validateResult.error.details.map((obj)=>{
                return obj.message
            })
            return next(new Error(errorMessages))
        }
        return next()
    }
}

export const ObjectIdValidation = (value , helper)=>{
    if (Types.ObjectId.isValid(value)) return true
    return helper.message("Invalid Object Id!") 
}