import {Router} from 'express'
import * as userController from './user.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as UserSchemas from './user.schema.js'
import { fileValidation, uploadFileCloud } from '../../utils/multer.js';

const router = Router()

//1 Sign Up
router.post("/signup",
    uploadFileCloud({ filter: fileValidation.files }).single("profilePic"),
    validation(UserSchemas.signUpSchema),
    userController.signUp)
    
   
//2 login email or phoneNumber and password , update status 
router.get("/signin",validation(UserSchemas.signInSchema),userController.signIn)

router.get("/profile",isAuthenticated,userController.profile)

//3 update account must be the account's owner
router.patch("/updateaccount",validation(UserSchemas.updateUserSchema),isAuthenticated,userController.updateAccount)

//4 Delete account - must be logged in - must be the account's owner
router.delete("/deleteuser",isAuthenticated,userController.deleteUser)

//5 get user account data
router.get("/user-account-data",isAuthenticated,userController.getAccData)

//7 Update password 
router.patch("/update-password",isAuthenticated,validation(UserSchemas.updatePassSchema),userController.updatePassword)

//8 Forget Password
router.patch("/send-forget-code",validation(UserSchemas.sendForgetPassCodeSchema),isAuthenticated,userController.sendForgetPassCode)
router.post("/forget-password",validation(UserSchemas.forgetPassSchema),isAuthenticated,userController.forgetPassword)

// activate Account
// router.get("/activateaccount/:token",validation(UserSchemas.activateAccSchema),userController.activateAccount)

export default router
