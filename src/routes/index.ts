import { Router } from 'express';
import userRoutes from './userRoutes';
import roleRoutes from './roleRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import buyerRoutes from './buyerRoutes';

const router = Router();

router.use('/user', userRoutes);
router.use('/roles', roleRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/buyer', buyerRoutes)

export default router;
