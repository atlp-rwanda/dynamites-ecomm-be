import { Router } from 'express';
import { checkRole } from '../middlewares/authorize';
import { getOneProduct } from '../controller/buyerController'
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { handlePayment } from '../controller/buyerController';

const buyerRouter = Router();

buyerRouter.get(
  '/get_product/:id',
  IsLoggedIn,
  checkRole(['Buyer']),
  getOneProduct
);

buyerRouter.post('/payment', handlePayment);
export default buyerRouter;
