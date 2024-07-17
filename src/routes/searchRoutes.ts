import { Router } from 'express';
import { searchProducts } from '../controller/searchProducts';
import { validateSearchParams } from '../middlewares/validateSearchParams';
const searchRouter = Router();

searchRouter.get('/search', validateSearchParams, searchProducts);

export default searchRouter;
