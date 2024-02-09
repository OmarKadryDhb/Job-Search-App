import {Router} from 'express'
import * as userController from './user.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as UserSchemas from './user.schema.js'

const router = Router()

//1 Sign Up
router.post("/signup",validation(UserSchemas.signUpSchema),userController.signUp)

//2 login email or phoneNumber and password , update status 
router.get("/signin",validation(UserSchemas.signInSchema),userController.signIn)

//3 update account must be the account's owner
router.patch("/updateaccount",validation(UserSchemas.updateUserSchema),isAuthenticated,userController.updateAccount)

//4 Delete account - must be logged in - must be the account's owner
router.delete("/deleteuser",isAuthenticated,userController.deleteUser)

//5 get user account data
router.get("/user-account-data",isAuthenticated,userController.getAccData)

//6 get profile data for another user
router.get("/profile-data/:id",isAuthenticated,userController.getOntherAccData)

//7 Update password 
router.patch("/update-password",validation(UserSchemas.updatePassSchema),isAuthenticated,userController.updatePassword)

//8 Forget Password
router.patch("/send-forget-code",validation(UserSchemas.sendForgetPassCodeSchema),isAuthenticated,userController.sendForgetPassCode)
router.post("/forget-password",validation(UserSchemas.forgetPassSchema),isAuthenticated,userController.forgetPassword)

//9 Get all accounts associated to a specific recovery Email 
router.get("/get-all-accounts",validation(UserSchemas.getAllAccountsSchema),isAuthenticated,userController.getAllAccounts)


export default router
