import { Router } from 'express';
import { checkRole } from '../middlewares/authorize';
import { buyerController } from '../controller/buyerController'

const buyerRouter = Router();


buyerRouter.get('/get_product/:id', buyerController.getOneProduct)

export default buyerRouter;
