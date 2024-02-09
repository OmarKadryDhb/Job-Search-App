import joi from 'joi'

// signup
export const signUpSchema = joi.object({
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    userName:joi.string(),
    email:joi.string().email().required(),
    password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    forgetPasswordCode:joi.string(),
    recoveryEmail:joi.string().email().required(),
    DOB:joi.date(),
    mobileNumber:joi.string().length(11).required(),
    role:joi.string().valid("hr","user").required(),
    status:joi.string()

}).required()

// signIn
export const signInSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
}).required()

//update Account 
export const updateUserSchema = joi.object({
    mobileNumber:joi.string().required(),
    DOB:joi.date(),
}).required()

//update password
export const updatePassSchema = joi.object({
    oldPassword:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    newPassword:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
}).required()

export const forgetPassSchema = joi.object({
    email:joi.string().email().required(),
    code:joi.string().length(6).required(),
    password:joi.string().required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required()
}).required()

export const sendForgetPassCodeSchema = joi.object({
    email:joi.string().email().required(),
}).required()

export const getAllAccountsSchema = joi.object({
    recoveryEmail:joi.string().email().required(),
}).required()