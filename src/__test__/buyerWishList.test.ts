import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
import jwt from 'jsonwebtoken';
import UserModel from '../database/models/userModel';
import dbConnection from '../database';
import {
    getBuyerToken,
    getVendorToken,
  } from './testSetup';
import buyerRouter from '../routes/buyerRoutes';
const userRepository = dbConnection.getRepository(UserModel);

beforeAll(beforeAllHook);
afterAll(afterAllHook);
let buyerToken: string;
let vendorToken: string;
let productId: number;
let categoryId: number;

beforeAll(async () => {
    buyerToken = await getBuyerToken();
    vendorToken = await getVendorToken();

  console.log("Vendot Token",vendorToken)
  console.log("buyer Toked",buyerToken)

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

    const response = await request(app)
      .post('/api/v1/product')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send(productData);

    productId = response.body.data.id;

    const getResponse = await request(app)
      .get(`/api/v1/buyer/get_product/${productId}`)
      .set('Authorization', `Bearer ${buyerToken}`);


    expect(getResponse.statusCode).toEqual(200);
    expect(getResponse.body.msg).toEqual('Product retrieved successfully');


});
 
  describe('POST /api/v1/buyer/addItemToWishList', () => {



    it('should add an item to the wishlist', async () => {

      const testProductId = 1; 

      const res = await request(app)
      .post('/api/v1/buyer/addItemToWishList')
      .set('Authorization', `Bearer ${buyerToken}`) 
      .send({
          productId: testProductId,
          time: '2024-05-21T12:00:00Z',
        
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toContain('WishList successfully created');
    });
  });

  describe('DELETE /api/v1/buyer/removeToWishList', () => {
    it('should remove a product from the wishlist', async () => {
      const testProductId = 1;

      const res = await request(app)
      .delete('/api/v1/buyer/removeToWishList')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
          productId: testProductId,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('Product successfully removed from wishlist');
    });
  });

  describe('GET /api/v1/buyer/getWishList', () => {
    it('should get all wishlists', async () => {
      const res = await request(app)
      .get('/api/v1/buyer/getWishList')
      .set('Authorization', `Bearer ${buyerToken}`); 

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('Data retrieved successfully');
    });

    describe('GET /api/v1/buyer/getOneWishList', () => {
      it('should get all wishlists', async () => {
        const res = await request(app)
        .get('/api/v1/buyer/getOneWishList')
        .set('Authorization', `Bearer ${buyerToken}`); 
  
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Data retrieved successfully');
      });
    })
})