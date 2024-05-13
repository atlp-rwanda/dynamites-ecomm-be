import { Router } from 'express';
// import userRoutes from './userRoutes';
import roleRoutes from './roleRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';

const router = Router();

// router.use('/user', userRoutes);
router.use('/roles', roleRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);

export default router;
