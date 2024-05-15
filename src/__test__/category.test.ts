import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
import dbConnection from '../database';
import UserModel from '../database/models/userModel';
const userRepository = dbConnection.getRepository(UserModel);

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Category Creation Tests', () => {
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

  it('should create a new category with valid data', async () => {
    const categoryData = {
      name: 'Test Category',
      description: 'Test category description',
    };

    const response = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(categoryData);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Category successfully created');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name', categoryData.name);
    expect(response.body.data).toHaveProperty(
      'description',
      categoryData.description
    );
  });

  it('should return a 400 status code if name is missing', async () => {
    const invalidData = {
      description: 'Test category description',
    };

    const response = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('Category name is required');
  });

  it('should return a 409 status code if category name already exists', async () => {
    // Create a category with the same name
    const existingCategoryData = {
      name: 'Existing Category',
      description: 'Existing category description',
    };
    await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(existingCategoryData);

    const newCategoryData = {
      name: 'Existing Category',
      description: 'Existing category description',
    };
    const response = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(newCategoryData);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Category name already exists');
  });
});
