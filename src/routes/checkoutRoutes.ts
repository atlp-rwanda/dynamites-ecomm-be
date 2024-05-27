import { Router } from 'express';
import { checkRole } from '../middlewares/authorize';
import { IsLoggedIn } from '../middlewares/isLoggedIn';

import {
  checkout,
  deleteAllOrders,
  getAllOrders,
  cancelOrder,
} from '../controller/cartController';

const checkoutRoutes = Router();
checkoutRoutes.use(IsLoggedIn, checkRole(['Buyer']));
checkoutRoutes.route('/').post(checkout);
checkoutRoutes.route('/removeall-order').delete(deleteAllOrders);
checkoutRoutes.route('/getall-order').get(getAllOrders);
checkoutRoutes.route('/cancel-order/:orderId').delete(cancelOrder);

export default checkoutRoutes;
