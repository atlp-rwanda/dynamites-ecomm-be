
import {createReview ,getReviews} from '../controller/reviewController';
import { Router } from 'express';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';

const reviewRoute = Router();
reviewRoute.use(IsLoggedIn , checkRole(['Buyer']))
reviewRoute.route('/').post( createReview).get(getReviews)

export default reviewRoute;
