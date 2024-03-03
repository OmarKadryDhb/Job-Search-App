import {Router} from 'express'
import * as cartController from './cart.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as CartSchemas from './cart.schema.js'
import { isAuthorized } from '../../middleware/authorization.middleware.js';

const router = Router()

//1 add to cart
router.post("/",
    isAuthenticated,isAuthorized("user"),
    validation(CartSchemas.addToCartSchema),
    cartController.addToCart)
    
   
//2 get user Cart 
router.get("/",
    isAuthenticated,isAuthorized("seller","admin","user"),
    validation(CartSchemas.getUserCartSchema),
    cartController.getUserCart
)

// update
router.patch("/",
    isAuthenticated,isAuthorized("user"),
    validation(CartSchemas.updateUserCartSchema),
    cartController.updateUserCart
)

// remove 
router.patch("/:productId",
    isAuthenticated,isAuthorized("user"),
    validation(CartSchemas.removeFromCartSchema),
    cartController.removeFromCart
)


//clear 
router.put("/",
    isAuthenticated,isAuthorized("user"),
    cartController.clearCart
)

export default router
