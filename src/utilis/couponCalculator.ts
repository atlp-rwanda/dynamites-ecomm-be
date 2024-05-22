import Coupon from '../database/models/couponEntity';
import Product from '../database/models/productEntity';
import dbConnection from '../database';

const couponRepository = dbConnection.getRepository(Coupon);

export default async function applyCoupon(product: Product, couponCode: string, price: number): Promise<number> {
    const coupon = await couponRepository.findOne({ where: { code: couponCode }, relations: ['applicableProducts'] });

    if (!coupon) {
        return price;
    }

    if (!coupon.applicableProducts.find(applicableProduct => applicableProduct.id === product.id)) {
        return price;
    }
    return price * (1 - coupon.percentage);
}
