import {Router} from 'express'
import * as orderController from './order.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as OrderSchemas from './order.schema.js'
import { isAuthorized } from '../../middleware/authorization.middleware.js';

const router = Router()

//1 create order
router.post("/",
    isAuthenticated,isAuthorized("user"),
    validation(OrderSchemas.createOrderSchema),
    orderController.createOrder)
    
   
// 2 cancel Order 
router.patch("/:orderId",
    isAuthenticated,isAuthorized("user"),
    validation(OrderSchemas.cancelOrderSchema),
    orderController.cancelOrder
)



export default router
