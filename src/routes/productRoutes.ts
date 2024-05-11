import { Router } from 'express';
import { getAllProducts } from '../controller/productController';

const route = Router();

route.get('/getAllProducts', getAllProducts);

export default route;
