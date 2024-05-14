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
// import { checkRole } from '../middlewares/authorize';

const productRouter = Router();

productRouter
  .route('/')
  .post(IsLoggedIn, createProduct)
  .get(getAllProducts)
  .delete(deleteAllProduct);
productRouter
  .route('/:productId')
  .get(getProduct)
  .put(IsLoggedIn, updateProduct)
  .delete(IsLoggedIn, deleteProduct);

export default productRouter;
