import joi from 'joi'

// signup
export const signUpSchema = joi.object({
    userName:joi.string().required(),
    email:joi.string().email().lowercase().required(),
    password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required(),
    phone:joi.string().length(11).required(),
    gender:joi.string().valid("Male","Female").required(),
    role:joi.string().valid("user","admin","seller").required(),
}).required()

// signIn
export const signInSchema = joi.object({
    email:joi.string().email(),
    password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
}).required()

// activateAccSchema
export const activateAccSchema = joi.object({
    token:joi.string().required()
  }).required()