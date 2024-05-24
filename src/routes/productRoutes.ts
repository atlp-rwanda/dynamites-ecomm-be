import { Router } from 'express';
import {
  createProduct,
  deleteAllProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  getRecommendedProducts,
  AvailableProducts,
  updateProductAvailability,
  checkProductAvailability
} from '../controller/productController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';
import validateAvailability from '../middlewares/availabilityValidator';

const productRouter = Router();

productRouter.route('/getAvailableProducts').get(AvailableProducts);

productRouter
  .route('/')
  .post(IsLoggedIn, checkRole(['Vendor']), createProduct)
  .get(getAllProducts)
  .delete(IsLoggedIn, deleteAllProduct);

productRouter.route('/recommended').get(getRecommendedProducts);

productRouter
  .route('/:productId')
  .get(getProduct)
  .put(IsLoggedIn, checkRole(['Vendor']), updateProduct)
  .delete(IsLoggedIn, deleteProduct);

productRouter
  .route('/:productId/availability')
  .get(IsLoggedIn, checkProductAvailability)
  .put(IsLoggedIn, checkRole(['Vendor']), validateAvailability, updateProductAvailability)

export default productRouter;
