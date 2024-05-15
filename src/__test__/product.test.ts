import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
import dbConnection from '../database';
import UserModel from '../database/models/userModel';
const userRepository = dbConnection.getRepository(UserModel);

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Products tests:', () => {
  let token: string;

  it('should log in a vendor with valid credentials', async () => {
    const formData = {
      name: 'Vendor',
      permissions: ['test-permission1', 'test-permission2'],
    };

    await request(app).post('/api/v1/roles/create_role').send(formData);

    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test1@gmail.com',
      password: 'TestPassword123',
      userType: 'vendor',
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

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.message).toBe(
        'Please provide the 2FA code sent to your email.'
      );
    }
  });

  it('should verify the 2FA code for a vendor user', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test1@gmail.com',
      password: 'TestPassword123',
      userType: 'vendor',
    };

    // Register the user
    await request(app).post('/api/v1/register').send(userData);

    // Verify the user
    let user = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (user) {
      user.isVerified = true;
      await userRepository.save(user);
    }
    const loginResponse = await request(app).post('/api/v1/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.message).toBe(
      'Please provide the 2FA code sent to your email.'
    );

    user = await userRepository.findOne({ where: { email: userData.email } });

    if (user) {
      const verifyResponse = await request(app)
        .post(`/api/v1/verify2FA/${user.id}`)
        .send({
          code: user.twoFactorCode,
        });

      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body).toHaveProperty('token');
      expect(verifyResponse.body.token).toBeDefined();
      token = verifyResponse.body.token;
    }
  });

  it('should create a new product with valid data', async () => {
    //   create a category
    const categoryData = {
      name: 'Category',
      description: 'category description',
    };

    const categoryResponse = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(categoryData);

    const productData = {
      name: 'Organic Apples',
      image: 'organic_apples.jpg',
      gallery: ['apples_gallery_1.jpg', 'apples_gallery_2.jpg'],
      shortDesc: 'Fresh and delicious organic apples',
      longDesc:
        'Our organic apples are grown with care and harvested at peak ripeness to ensure maximum flavor and nutrition. Perfect for snacking, baking, or adding to salads.',
      categoryId: categoryResponse.body.id,
      quantity: 200,
      regularPrice: 2,
      salesPrice: 1,
      tags: ['organic', 'apples', 'fruit', 'healthy'],
      type: 'Simple',
      isAvailable: true,
    };

    const response = await request(app)
      .post('/api/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send(productData);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Product successfully created');
    expect(response.body.data).toBeDefined();
  });

  it('It should return the list of products', async () => {
    const { body } = await request(app).get('/api/v1/product').expect(200);
    expect(body.data).toBeDefined();
    expect(body.message).toStrictEqual('Data retrieved successfully');
  });
});
