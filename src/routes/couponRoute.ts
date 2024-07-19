import express from 'express';
import CouponController from '../controller/couponController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';

const couponRouter = express.Router();

const controller = new CouponController();

couponRouter
  .route('/')
  .get(controller.getAllCoupons)
  .post(IsLoggedIn, checkRole(['Vendor']), controller.createCoupon);

couponRouter
  .route('/mine')
  .get(IsLoggedIn, checkRole(['Vendor']), controller.getCouponsByVendor);

couponRouter
  .route('/:id')
  .get(controller.getCouponById)
  .put(IsLoggedIn, checkRole(['Vendor', 'Admin']), controller.updateCoupon)
  .delete(IsLoggedIn, checkRole(['Vendor', 'Admin']), controller.deleteCoupon);

export default couponRouter;
