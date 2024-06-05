import request from 'supertest';
import app from '../app';
import { getBuyerToken, afterAllHook, beforeAllHook } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Service Controller Tests', () => {
  let token: string;

  beforeAll(async () => {
    token = await getBuyerToken();
  });

  const serviceData = {
    name: 'test service',
    description: 'new description',
  };

  it('should create a new service with valid data', async () => {
    const response = await request(app)
      .post('/api/v1/service')
      .set('Authorization', `Bearer ${token}`)
      .send(serviceData);

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual('Service created successfully');
    expect(response.body.service).toBeDefined();
  });

  it('should return 409 if service name already exists', async () => {
    const response = await request(app)
      .post('/api/v1/service')
      .set('Authorization', `Bearer ${token}`)
      .send(serviceData);

    expect(response.statusCode).toEqual(409);
    expect(response.body.message).toEqual(
      'Service with this name already exists'
    );
  });

  it('should retrieve all services', async () => {
    const response = await request(app)
      .get('/api/v1/services')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.services).toBeDefined();
    expect(Array.isArray(response.body.services)).toBeTruthy();
  });

  it('should return 401 if unauthorized', async () => {
    const response = await request(app).get('/api/v1/services');

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual('Unauthorized: No token provided');
  });
});
