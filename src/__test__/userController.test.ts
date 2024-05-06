import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
import jwt from 'jsonwebtoken';
import dbConnection from '../database';
import { UserModel
 } from '../database/models';
beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('User Registration Tests', () => {
  it('should register a new user with valid data', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'TestPassword123',
      userType: 'buyer',
    };
    const response = await request(app).post('/api/v1/register').send(userData);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User successfully registered');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('firstName', userData.firstName);
    expect(response.body.user).toHaveProperty('lastName', userData.lastName);
    expect(response.body.user).toHaveProperty('email', userData.email);
    expect(response.body.user).toHaveProperty('userType', userData.userType);
  });

  it('should return a 400 status code if validation fails', async () => {
    const invalidData = {
      firstName: '',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'TestPassword',
      userType: 'buyer',
    };

    const response = await request(app)
      .post('/api/v1/register')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('First name is required');
  });

  it('should return a 409 status code if the email already exists', async () => {
    // Setup: Ensure a user with the specified email exists
    const existingUserData = {
      firstName: 'Existing',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'ExistingPassword123',
      userType: 'buyer',
    };
    await request(app).post('/api/v1/register').send(existingUserData);
  
    // Test: Attempt to register a new user with the same email
    const userData = {
      firstName: 'Existing',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'ExistingPassword123',
      userType: 'buyer',
    };
  
    const response = await request(app).post('/api/v1/register').send(userData);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already exists');
  });

  it('should confirm user email with a valid token', async () => {
    // Create a new user
    const newUser = new UserModel({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'TestPassword123',
      userType: 'buyer',
    });
    await dbConnection.getRepository(UserModel).save(newUser);
  
    // Generate a token for the user
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: '1d' }
    );
  
    // Send a request to confirm the email with the token
    const response = await request(app).get(`/api/v1/confirm?token=${token}`);
  
    // Check the response
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email confirmed successfully');
  
    // Check if the user's email is now verified
    const updatedUser = await dbConnection.getRepository(UserModel).findOne({ where: { id: newUser.id } });

    expect(updatedUser?.isVerified).toBe(true);
  });
  
  it('should return a 400 status code with invalid or expired token', async () => {
    // Send a request with an invalid or expired token
    const invalidToken = 'invalid_token';
    const response = await request(app).get(`/api/v1/confirm?token=${invalidToken}`);
  
    // Check the response
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid or expired token');
  });
  
  it('should return a 400 status code if token is missing', async () => {
    // Send a request without a token
    const response = await request(app).get('/api/v1/confirm');
  
    // Check the response
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Token is required');
  });

  it('should return a 404 status code if the user is not found', async () => {
    const nonExistentUserId = 999;
    const token = jwt.sign(
      { userId: nonExistentUserId, email: 'nonexistent@example.com' },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: '1d' }
    );

    const response = await request(app).get(`/api/v1/confirm?token=${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
  
});






