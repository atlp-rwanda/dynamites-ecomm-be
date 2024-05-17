import { Router } from 'express';
import userRouter from './userRoutes';
import roleRoutes from './roleRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import available_products_route from './list_productsRoute'

const router = Router();

router.use('/user', userRouter);
router.use('/roles', roleRoutes);
router.use('/product', productRoutes);
router.use('/getAvailableProducts',available_products_route)
router.use('/category', categoryRoutes);

export default router;
