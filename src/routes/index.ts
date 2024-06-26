import { Router } from 'express';
import userRouter from './userRoutes';
import roleRoutes from './roleRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import buyerRoutes from './buyerRoutes';
import cartRoutes from '../routes/cartRoutes';
import couponRouter from './couponRoute';
import chekoutRoutes from './checkoutRoutes';
import reviewRoute from './reviewRoutes';
import orderRoutes from './orderRoutes';
import noticificationRoute from './notificationRoutes' 
const router = Router();

router.use('/user', userRouter);
router.use('/roles', roleRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/buyer', buyerRoutes);
router.use('/cart', cartRoutes);
router.use('/coupons', couponRouter);
router.use('/checkout', chekoutRoutes);
router.use('/review', reviewRoute);
router.use('/order', orderRoutes);
router.use('/notification',noticificationRoute)
export default router;
