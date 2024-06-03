import { Router } from 'express';

import { updateOrderStatus } from '../controller/orderController';

const orderRoutes = Router();

orderRoutes.route('/:orderId').put(updateOrderStatus);

export default orderRoutes;
