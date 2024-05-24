import { Router } from 'express';
import userRouter from './userRoutes';
import roleRoutes from './roleRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import buyerRoutes from './buyerRoutes';
import cartRoutes from '../routes/cartRoutes';

const router = Router();

router.use('/user', userRouter);
router.use('/roles', roleRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/buyer', buyerRoutes);
router.use('/cart', cartRoutes);

export default router;
