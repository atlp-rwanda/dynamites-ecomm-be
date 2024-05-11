import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from '../controller/categoryController';
const categoryRouter = Router();

categoryRouter.route('/').post(createCategory).get(getAllCategories);
categoryRouter
  .route('/:categoryId')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default categoryRouter;
