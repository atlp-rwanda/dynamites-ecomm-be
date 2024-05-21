import { Router } from 'express';
import { searchProducts } from '../controller/searchProducts'
import { validateSearchParams } from '../middlewares/validateSearchParams';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';
const searchRouter = Router();

searchRouter.get('/search', IsLoggedIn,checkRole(['Buyer']), validateSearchParams, searchProducts);

export default searchRouter;