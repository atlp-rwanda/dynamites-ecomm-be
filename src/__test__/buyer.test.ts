import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
import jwt from 'jsonwebtoken';
import UserModel from '../database/models/userModel';
import dbConnection from '../database';
const userRepository = dbConnection.getRepository(UserModel);

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('WishList Controller Tests', () => {
    let token: string;

  beforeAll(async () => {
   
    const formData = {
      name: 'Buyer',
      permissions: ['test-permission1', 'test-permission2'],
    };

    const roleResponse = await request(app)
     .post('/api/v1/roles/create_role')
     .send(formData);

    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'tresorxaier16@gmail.com',
      password: 'TestPassword123',
      userType: roleResponse.body.id,
    };
    await request(app).post('/api/v1/register').send(userData);

    const updatedUser = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (updatedUser) {
      updatedUser.isVerified = true;
      await userRepository.save(updatedUser);

      const loginResponse = await request(app).post('/api/v1/login').send({
        email: userData.email,
        password: userData.password,
      });

      // Store the token for later use
      token = loginResponse.body.token;
    }

    // Decode the token and check its properties
    const decodedToken = jwt.decode(token);
    expect(decodedToken).toHaveProperty('user');
    expect(decodedToken).toHaveProperty('iat');
    expect(decodedToken).toHaveProperty('exp');
  });

  describe('POST /api/v1/buyer/addItemToWishList', () => {
    it('should add an item to the wishlist', async () => {
      const testUserId = 1; 
      const testProductId = 1; 

      const res = await request(app)
      .post('/api/v1/buyer/addItemToWishList')
      .set('Authorization', `Bearer ${token}`) 
      .send({
          userId: testUserId,
          productId: testProductId,
          time: '2024-05-21T12:00:00Z',
          categoryId: 1,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toContain('WishList successfully created');
    });
  });

  describe('DELETE /api/v1/buyer/removeToWishList', () => {
    it('should remove a product from the wishlist', async () => {
      const testUserId = 1; 
      const testProductId = 1;

      const res = await request(app)
      .delete('/api/v1/buyer/removeToWishList')
      .set('Authorization', `Bearer ${token}`)
      .send({
          userId: testUserId,
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
      .set('Authorization', `Bearer ${token}`); 

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('Data retrieved successfully');
    });
  });
});