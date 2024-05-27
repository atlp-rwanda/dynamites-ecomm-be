import { Router } from 'express';
import { checkRole } from '../middlewares/authorize';
import { IsLoggedIn } from '../middlewares/isLoggedIn';

import {
  addToCart,
  getCartItems,
  removeItem,
  removeAllItems,
  updateQuantity,
} from '../controller/cartController';

const cartRouter = Router();
cartRouter.use(IsLoggedIn, checkRole(['Buyer']));

cartRouter.route('/').post(addToCart).get(getCartItems).delete(removeAllItems);
cartRouter.route('/:itemId').delete(removeItem).patch(updateQuantity);
export default cartRouter;
