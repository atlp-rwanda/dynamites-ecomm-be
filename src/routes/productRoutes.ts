import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProduct,
} from '../controller/productController';

const productRouter = Router();

productRouter.route('/').post(createProduct).get(getAllProducts);
productRouter.route('/:productId').get(getProduct);

export default productRouter;
