import { Router } from 'express';
import { getAllCategories } from '../controller/categoryController';
const route = Router();

route.get('/getAllCategories', getAllCategories);

export default route;
