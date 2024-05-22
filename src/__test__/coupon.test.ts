import request from 'supertest';
import app from '../app';
import { getVendorToken, afterAllHook, beforeAllHook } from './testSetup';


beforeAll(beforeAllHook);
afterAll(afterAllHook);


describe('Coupon Controller Tests', () => {
    let token: string;
    let couponId: number;
    let productId: number;

    beforeAll(async () => {
        token = await getVendorToken();
    });

    it('should create a new coupon with valid data', async () => {
        const categoryData = {
            name: 'Category',
            description: 'category description',
          };
      
        const categoryResponse = await request(app)
            .post('/api/v1/category')
            .set('Authorization', `Bearer ${token}`)
            .send(categoryData);
      
        const categoryId = categoryResponse.body.data.id;
        const productData = {
            name: 'New Product',
            image: 'new_product.jpg',
            gallery: [],
            shortDesc: 'This is a new product',
            longDesc: 'Detailed description of the new product',
            categoryId: categoryId,
            quantity: 10,
            regularPrice: 5,
            salesPrice: 4,
            tags: ['tag1', 'tag2'],
            type: 'Simple',
            isAvailable: true,
        };

        const productResponse = await request(app)
            .post('/api/v1/product')
            .set('Authorization', `Bearer ${token}`)
            .send(productData);

        expect(productResponse.statusCode).toEqual(201);
        expect(productResponse.body.message).toEqual('Product successfully created');
        expect(productResponse.body.data).toBeDefined();
        productId = productResponse.body.data.id;

        const couponData = {
            description: 'New Coupon',
            percentage: 30,
            expirationDate: '2024-12-31',
            applicableProducts: [productId],
        };

        const response = await request(app)
            .post('/api/v1/coupons')
            .set('Authorization', `Bearer ${token}`)
            .send(couponData);

        expect(response.statusCode).toEqual(201);
        expect(response.body.message).toEqual('Coupon created successfully');
        expect(response.body.data).toBeDefined();
        couponId = response.body.data.id;
    });

    it('should return validation errors for invalid coupon data', async () => {
        const invalidCouponData = {
            description: '',
            percentage: 120,
            expirationDate: '2022-12-31',
            applicableProducts: [],
        };

        const response = await request(app)
            .post('/api/v1/coupons')
            .set('Authorization', `Bearer ${token}`)
            .send(invalidCouponData);

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors).toBeDefined();
    });

    it ('should return a 404 for a non-existent product', async () => {
        const nonExistentProductId = 999;
        const couponData = {
            description: 'New Coupon',
            percentage: 30,
            expirationDate: '2024-12-31',
            applicableProducts: [nonExistentProductId],
        };

        const response = await request(app)
            .post('/api/v1/coupons')
            .set('Authorization', `Bearer ${token}`)
            .send(couponData);

        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toEqual(`Product with id ${nonExistentProductId} not found`);
    })

    it('should return a 404 for a non-existent coupon', async () => {
        const nonExistentCouponId = 999;
        const response = await request(app).get(`/api/v1/coupons/${nonExistentCouponId}`);

        expect(response.statusCode).toEqual(404);
        expect(response.body.error).toEqual('Coupon not found');
    });

    it('should return a 401 for an unauthenticated user', async () => {
        const couponData = {
            description: 'New Coupon',
            percentage: 30,
            expirationDate: '2024-12-31',
            applicableProducts: [productId],
        };

        const response = await request(app)
            .post('/api/v1/coupons')
            .set('Authorization', 'Invalid Token')
            .send(couponData);
        expect(response.statusCode).toEqual(401);
    })

    it('should return a 403 for a user trying to create a coupon for another user\'s product', async () => {
        const otherVendorToken = await getVendorToken(
            'email@example.com',
            'Password123',
            'OtherVendor',
            'OtherName'
        )
        const couponData = {
            description: 'New Coupon',
            percentage: 30,
            expirationDate: '2024-12-31',
            applicableProducts: [productId],
        };

        const response = await request(app)
            .post('/api/v1/coupons')
            .set('Authorization', `Bearer ${otherVendorToken}`)
            .send(couponData);
        expect(response.statusCode).toEqual(403);
        expect(response.body.error).toEqual('You can only create coupons for your own products');
    })

    it('should retrieve all coupons', async () => {
        const response = await request(app).get('/api/v1/coupons');

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should retrieve all coupons by vendor', async () => {
        const response = await request(app)
            .get('/api/v1/coupons/mine')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    })

    it('should retrieve a single coupon by ID', async () => {
        const response = await request(app).get(`/api/v1/coupons/${couponId}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toBeDefined();
    });

    it('should update a coupon by ID', async () => {
        const updatedCouponData = {
            description: 'Updated Coupon',
            percentage: 20,
            expirationDate: '2023-12-31',
            applicableProducts: [productId],
        };

        const response = await request(app)
            .put(`/api/v1/coupons/${couponId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedCouponData);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toBeDefined();
    });

    it('should return a 404 for a non-existent coupon while updating', async () => {
        const nonExistentCouponId = 999;
        const updatedCouponData = {
            description: 'Updated Coupon',
            percentage: 20,
            expirationDate: '2023-12-31',
            applicableProducts: [productId],
        };

        const response = await request(app)
            .put(`/api/v1/coupons/${nonExistentCouponId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedCouponData);

        expect(response.statusCode).toEqual(404);
        expect(response.body.error).toEqual('Coupon not found');
    });
    

    it('should return a 403 for a user trying to update a coupon for another user', async () => {
        const otherVendorToken = await getVendorToken(
            'email@example.com',
            'Password123',
            'OtherVendor',
            'OtherName'
        )
        const couponData = {
            description: 'Updated Coupon',
            percentage: 30,
            expirationDate: '2024-12-31',
            applicableProducts: [productId],
        };

        const response = await request(app)
            .put(`/api/v1/coupons/${couponId}`)
            .set('Authorization', `Bearer ${otherVendorToken}`)
            .send(couponData);
        expect(response.statusCode).toEqual(403);
        expect(response.body.error).toEqual('You can only create coupons for your own products');
    })

    it('should return a 401 for an unauthenticated user', async () => {
        const couponData = {
            description: 'New Coupon',
            percentage: 30,
            expirationDate: '2024-12-31',
            applicableProducts: [productId],
        };

        const response = await request(app)
            .put(`/api/v1/coupons/${couponId}`)
            .set('Authorization', 'Invalid Token')
            .send(couponData);
        expect(response.statusCode).toEqual(401);
    })

        it('should return a 401 for an unauthenticated user', async () => {
        const couponData = {
            description: 'New Coupon',
            percentage: 30,
            expirationDate: '2024-12-31',
            applicableProducts: [productId],
        };

        const response = await request(app)
            .post('/api/v1/coupons')
            .set('Authorization', 'Invalid Token')
            .send(couponData);
        expect(response.statusCode).toEqual(401);
    })

    it ('should return a 404 for a non-existent product', async () => {
        const nonExistentProductId = 999;
        const couponData = {
            description: 'New Coupon',
            percentage: 30,
            expirationDate: '2024-12-31',
            applicableProducts: [nonExistentProductId],
        };

        const response = await request(app)
            .put(`/api/v1/coupons/${couponId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(couponData);

        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toEqual(`Product with id ${nonExistentProductId} not found`);
    })

    it('should return validation errors for invalid update data', async () => {
        const invalidUpdateData = {
            description: '',
            percentage: 120,
            expirationDate: '2022-12-31',
            applicableProducts: [],
        };

        const response = await request(app)
            .put(`/api/v1/coupons/${couponId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(invalidUpdateData);

        expect(response.statusCode).toEqual(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should return a 403 for a user trying to delete a coupon for another user', async () => {
        const otherVendorToken = await getVendorToken(
            'email@example.com',
            'Password123',
            'OtherVendor',
            'OtherName'
        )

        const response = await request(app)
            .delete(`/api/v1/coupons/${couponId}`)
            .set('Authorization', `Bearer ${otherVendorToken}`)
        expect(response.statusCode).toEqual(403);
        expect(response.body.error).toEqual('You can only delete your own coupons');
    })

    it('should delete a coupon by ID', async () => {
        const response = await request(app)
            .delete(`/api/v1/coupons/${couponId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(204);
    });

    it('should return a 404 for a non-existent coupon', async () => {
        const nonExistentCouponId = 999;
        const response = await request(app)
            .delete(`/api/v1/coupons/${nonExistentCouponId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(404);
        expect(response.body.error).toEqual('Coupon not found');
    });
});
