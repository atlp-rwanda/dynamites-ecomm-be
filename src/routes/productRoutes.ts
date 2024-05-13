import { Router } from 'express';
import { createProduct, getAllProducts } from '../controller/productController';

const productRouter = Router();

productRouter.route('/').post(createProduct).get(getAllProducts);

export default productRouter;
