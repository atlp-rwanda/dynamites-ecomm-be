import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  getCategoryMetrics,
  updateCategory,
} from '../controller/categoryController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';

const categoryRouter = Router();

categoryRouter.route('/get_metrics').get(IsLoggedIn, checkRole(['Admin']), getCategoryMetrics) 

categoryRouter
  .route('/')
  .post(IsLoggedIn, createCategory)
  .get(getAllCategories);
categoryRouter
  .route('/:categoryId')
  .get(getCategory)
  .put(IsLoggedIn, updateCategory)
  .delete(IsLoggedIn, deleteCategory);


export default categoryRouter;