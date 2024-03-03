import {Router} from 'express'
import * as reviewController from './review.controller.js'
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { validation } from './../../middleware/validation.middleware.js';
import * as ReviewSchemas from './review.schema.js'
import { isAuthorized } from '../../middleware/authorization.middleware.js';

const router = Router({mergeParams:true})



//1 create review
router.post("/",
    isAuthenticated,isAuthorized("user"),
    validation(ReviewSchemas.addReviewSchema),
    reviewController.addReview)
    
   
// 2 update review 
router.patch("/:reviewId",
    isAuthenticated,isAuthorized("user"),
    validation(ReviewSchemas.updateReviewSchema),
    reviewController.updateReview
)



export default router
