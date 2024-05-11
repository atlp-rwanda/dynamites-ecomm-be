import { Router } from 'express';
import { getAllProducts } from '../controller/productController';

const productRouter = Router();

productRouter.route('/').get(getAllProducts);

export default productRouter;
