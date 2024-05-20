import { Router } from 'express';
import { checkRole } from '../middlewares/authorize';
import { getOneProduct } from '../controller/buyerController'
import { IsLoggedIn } from '../middlewares/isLoggedIn';

const buyerRouter = Router();

buyerRouter.get(
  '/get_product/:id',
  IsLoggedIn,
  checkRole(['Buyer']),
  getOneProduct
);

export default buyerRouter;