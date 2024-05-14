import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  AvailableProducts
} from '../controller/productController';

const productRouter = Router();
productRouter.route('/getAvailableProducts').get(AvailableProducts)
productRouter.route('/').post(createProduct).get(getAllProducts);
productRouter.route('/:productId').get(getProduct).delete(deleteProduct);

export default productRouter;
