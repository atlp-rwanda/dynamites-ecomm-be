import { Router } from 'express';
import userRouter from './userRoutes';
import roleRoutes from './roleRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import BuyerWishListroute from './buyer'

const router = Router();

router.use('/user', userRouter);
router.use('/buyer',BuyerWishListroute);
router.use('/roles', roleRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);

export default router;
