import { Router } from 'express';
import {
  createProduct,
  deleteAllProduct,
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
  .get(IsLoggedIn, getAllProducts)
  .delete(IsLoggedIn, deleteAllProduct);
productRouter
  .route('/:productId')
  .get(getProduct)
  .put(IsLoggedIn, checkRole(['Vendor']), updateProduct)
  .delete(IsLoggedIn, deleteProduct);

export default productRouter;
