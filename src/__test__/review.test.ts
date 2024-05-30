import request from 'supertest';
import app from '../app';
import {
  afterAllHook,
  beforeAllHook,
  getBuyerToken,
  getVendorToken,
} from './testSetup';
beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Review  controller test', () => {
    let buyerToken: string;
    let vendorToken: string;
    let productId: number;
    let categoryId: number;
  
    beforeAll(async () => {
      buyerToken = await getBuyerToken();
      vendorToken = await getVendorToken();
    });

    it('should return review product has successfully', async () => {
        const categoryData = {
            name: 'Category4',
            description: 'category description',
        };
  
        const categoryResponse = await request(app)
        .post('/api/v1/category')
        .set('Authorization', `Bearer ${vendorToken}`)
        .send(categoryData);
  
        categoryId = categoryResponse.body.data.id;
  
        const productData = {
            name: 'New Product Two',
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
    
        const responseProduct = await request(app)
        .post('/api/v1/product')
        .set('Authorization', `Bearer ${vendorToken}`)
        .send(productData);
        
  
        productId = responseProduct.body.data.id;
        const reviewBody = {content:'good', rating:5, productId}
        const responseReview = await request(app)
        .post('/api/v1/review')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(reviewBody);
        expect(responseReview.statusCode).toEqual(201);
        expect(responseReview.body.message).toEqual('Review created successfully');
        expect(responseReview.body.review).toBeDefined();
    }),

    it('should return 404 if product is not found', async () => {
        const reviewBody = {content:'good', rating:5, productId:99}
        const responseReview = await request(app)
        .post('/api/v1/review')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(reviewBody);
        expect(responseReview.statusCode).toEqual(404);
        expect(responseReview.body.message).toEqual('Product not found');
    }),
    it('should return 200 Ok to get all reviews ', async () => {
        const responseReview = await request(app)
        .get('/api/v1/review')
        .set('Authorization', `Bearer ${buyerToken}`)
        expect(responseReview.statusCode).toEqual(200);
        expect(responseReview.body.reviews).toBeDefined();
    }),
    it('should return 409  if the review  exist', async () => {
        const reviewBody = {content:'good', rating:5, productId}
        const responseReview = await request(app)
        .post('/api/v1/review')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(reviewBody)
        expect(responseReview.statusCode).toEqual(409);
        expect(responseReview.body.message).toEqual('you are already reviewed the product');

    })

    it('should return 400 for failed validation on create review', async () => {
        const reviewBody = {content:'good', rating:15, productId:'some id'}
        const responseReview = await request(app)
        .post('/api/v1/review')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(reviewBody)
        expect(responseReview.statusCode).toEqual(400);
    })
})