import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../controller/productController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';

const productRouter = Router();

productRouter
  .route('/')
  .post(IsLoggedIn, checkRole(['Vendor']), createProduct)
  .get(getAllProducts);
productRouter
  .route('/:productId')
  .get(getProduct)
  .put(IsLoggedIn, updateProduct)
  .delete(IsLoggedIn, deleteProduct);

export default productRouter;
