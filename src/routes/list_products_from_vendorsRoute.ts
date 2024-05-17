import { Router } from 'express';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';
import AvailableProducts from '../controller/list_products_from_vendorsController';
const available_products_route=Router()

available_products_route.route('/').get(AvailableProducts)

export default available_products_route