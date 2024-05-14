import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from '../controller/categoryController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';

const categoryRouter = Router();

categoryRouter
  .route('/')
  .post(createCategory)
  .get(getAllCategories);
categoryRouter
  .route('/:categoryId')
  .get(getCategory)
  .put(IsLoggedIn, updateCategory)
  .delete(IsLoggedIn,deleteCategory);

export default categoryRouter;
