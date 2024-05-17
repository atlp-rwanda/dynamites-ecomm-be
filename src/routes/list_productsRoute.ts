import { Router } from 'express';
import AvailableProducts from '../controller/list_productsController';
const available_products_route=Router()

available_products_route.route('/').get(AvailableProducts)

export default available_products_route