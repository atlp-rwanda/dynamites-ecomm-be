import { Router } from 'express';
import { checkRole } from '../middlewares/authorize';
import { 
  MomohandlePayment,
  checkPaymentStatus,
  getOneProduct } from '../controller/buyerController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import {
  AddItemInWishList,
  RemoveProductFromWishList,
  getAllWishList,
  getOneWishList,
} from '../controller/buyerWishlistController';
import { handlePayment } from '../controller/buyerController';

const buyerRouter = Router();

buyerRouter.use(IsLoggedIn, checkRole(['Buyer']));

buyerRouter.get('/get_product/:id', getOneProduct);

buyerRouter.post('/addItemToWishList', IsLoggedIn, AddItemInWishList);
buyerRouter.delete('/removeToWishList', IsLoggedIn, RemoveProductFromWishList);
buyerRouter.get('/getWishList', IsLoggedIn, getAllWishList);
buyerRouter.get('/getOneWishList', IsLoggedIn, getOneWishList);

buyerRouter.post('/payment', handlePayment);
buyerRouter.post('/momoPay', MomohandlePayment);
buyerRouter.post('/getPaymentStatus/:id', checkPaymentStatus);

export default buyerRouter;
