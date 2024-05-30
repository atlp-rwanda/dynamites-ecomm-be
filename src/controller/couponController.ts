import { Request, Response } from 'express';
import Coupon from '../database/models/couponEntity';
import dbConnection from '../database';
import errorHandler from '../middlewares/errorHandler';
import { check, validationResult } from 'express-validator';
import Product from '../database/models/productEntity';
import crypto from 'crypto';
import UserModel from '../database/models/userModel';

const couponRepository = dbConnection.getRepository(Coupon);
const productRepository = dbConnection.getRepository(Product);

interface couponRequestBody {
    description: string;
    percentage: number;
    expirationDate: Date;
    applicableProducts: number[];
}

const createCouponRules = [
    check('description').isLength({ min: 1 }).withMessage('coupon description is required'),
    check('percentage').isInt({ min: 0, max: 100 }).withMessage('percentage must be between 0 and 100'),
    check('expirationDate').isDate().withMessage('expiration date must be a valid date'),
    check('applicableProducts').isArray().withMessage('applicable products must be an array of product ids'),
]
class CouponController {
    // GET /coupons
    public getAllCoupons = errorHandler(async (req: Request, res: Response) => {
        const coupons = await couponRepository.find();
        return res.status(200).json(coupons);
    })

    public getCouponsByVendor = errorHandler(async (req: Request, res: Response) => {
        const vendorId = (req.user as UserModel).id;
        const coupons = await couponRepository
            .createQueryBuilder('coupon')
            .innerJoinAndSelect('coupon.applicableProducts', 'product')
            .innerJoinAndSelect('product.vendor', 'vendor')
            .where('vendor.id = :vendorId', { vendorId })
            .getMany();
        return res.status(200).json(coupons);
    })

    // POST /coupons
    public createCoupon = [
        ...createCouponRules,
        errorHandler(async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
            const { description, percentage, expirationDate, applicableProducts  } = req.body as couponRequestBody;
            const products: Product[] = []
            for (const productId of applicableProducts) {
                const product = await productRepository.findOne({
                    where: { id: productId },
                    relations: ['vendor']
                });
                if (!product) {
                    return res.status(400).json({ error: `Product with id ${productId} not found` });
                }
                if (product.vendor.id !== (req.user as UserModel).id) {
                    return res.status(403).json({ error: 'You can only create coupons for your own products' });
                }
                products.push(product);
            }
            let code = crypto.randomBytes(4).toString('hex');
            while (await couponRepository.findOne({ where: { code } })) {
                /* istanbul ignore end */
                code = crypto.randomBytes(4).toString('hex'); // there is no way to test this
                /* istanbul ignore end */
            }
            const coupon = new Coupon({ 
                code,
                description, 
                percentage, 
                expirationDate, 
                applicableProducts: products
             });
            const newCoupon = await couponRepository.save(coupon);
            res.status(201).json({
                message: 'Coupon created successfully',
                data: newCoupon
            });
        })
    ]

    // GET /coupons/:id
    public getCouponById = errorHandler(async(req: Request, res: Response) => {
        const { id } = req.params;
        const coupon = await couponRepository.findOne({ 
            where: { id: Number(id) }, 
            relations: ['applicableProducts']
        });
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        } else {
            return res.status(200).json(coupon);
        }
    })

    // PUT /coupons/:id
    public updateCoupon = [
        ...createCouponRules,
        errorHandler(async(req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
            const { id } = req.params;
            const { description, percentage, expirationDate, applicableProducts  } = req.body as couponRequestBody;
            const coupon = await couponRepository.findOne({
                where: { id: Number(id) },
            });
            if (!coupon) {
                return res.status(404).json({ error: 'Coupon not found' });
            }
            coupon.description = description;
            coupon.percentage = percentage;
            coupon.expirationDate = expirationDate;
            const products: Product[] = []
            for (const productId of applicableProducts) {
                const product = await productRepository.findOne({
                    where: { id: productId },
                    relations: ['vendor']
                });
                if (!product) {
                    return res.status(400).json({ error: `Product with id ${productId} not found` });
                }
                if (product.vendor.id !== (req.user as UserModel).id) {
                    return res.status(403).json({ error: 'You can only create coupons for your own products' });
                }
                products.push(product);
            }
            coupon.applicableProducts = products;
            const updatedCoupon = await couponRepository.save(coupon)
            return res.status(200).json(updatedCoupon);
        })
    ]

    // DELETE /coupons/:id
    public deleteCoupon = errorHandler(async(req: Request, res: Response) => {
        const { id } = req.params;
        const deletedCoupon = await couponRepository.findOne({
            where: { id: Number(id) },
            relations: ['applicableProducts', 'applicableProducts.vendor']
        });
        if (!deletedCoupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        if (deletedCoupon.applicableProducts[0].vendor.id !== (req.user as UserModel).id) {
            return res.status(403).json({ error: 'You can only delete your own coupons' });
        } else {
            await couponRepository.delete({ id: Number(id) });
            return res.status(204).end();
        }
    })
}

export default CouponController;
