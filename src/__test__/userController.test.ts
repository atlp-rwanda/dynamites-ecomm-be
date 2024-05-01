import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';

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
    expect(response.body.user).toHaveProperty(
      'userType',
      response.body.user.userType
    );
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
});
