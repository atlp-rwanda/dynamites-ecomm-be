import { Router } from 'express';
import { checkRole } from '../middlewares/authorize';
import { getOneProduct } from '../controller/buyerController';

import { IsLoggedIn } from '../middlewares/isLoggedIn';

const buyerRouter = Router();

buyerRouter.use(IsLoggedIn, checkRole(['Buyer']));

buyerRouter.get('/get_product/:id', getOneProduct);

export default buyerRouter;
