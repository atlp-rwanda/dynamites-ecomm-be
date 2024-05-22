import express from 'express';
import CouponController from '../controller/couponController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';


const couponRouter = express.Router();

const controller = new CouponController();

couponRouter.route('/')
    .get(controller.getAllCoupons)
    .post(IsLoggedIn, controller.createCoupon);

couponRouter.route('/mine')
    .get(IsLoggedIn, controller.getCouponsByVendor);

couponRouter.route('/:id')
    .get(controller.getCouponById)
    .put(IsLoggedIn, controller.updateCoupon)
    .delete(IsLoggedIn, controller.deleteCoupon);

export default couponRouter;
