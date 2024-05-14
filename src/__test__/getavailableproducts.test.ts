import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
import jwt from 'jsonwebtoken';
import dbConnection from '../database';
import  UserModel  from '../database/models/userModel';
const userRepository = dbConnection.getRepository(UserModel);

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('GET /api/v1/product/getAvailableProducts', () => {
  it('should return status 200 with available products', async () => {

    const response = await request(app).get('/api/v1/product/getAvailableProducts');
    expect(response.status).toBe(200);
  });

  it('should return json', async()=>{
    const response = await request(app).get('/api/v1/product/getAvailableProducts');
    expect(response.headers['content-type']).toContain('application/json')
  })

  it('should return status success', async()=>{
    const response = await request(app).get('/api/v1/product/getAvailableProducts');
    expect(response.body).toHaveProperty('status', 'success');
  })

  it('should return availableProducts', async()=>{
    const response = await request(app).get('/api/v1/product/getAvailableProducts');
    expect(response.body).toHaveProperty('availableProducts');
  })

  it('should return totalPages', async()=>{
    const response = await request(app).get('/api/v1/product/getAvailableProducts');
    expect(response.body).toHaveProperty('totalPages');
  })

  it('should return currentPage', async()=>{
    const response = await request(app).get('/api/v1/product/getAvailableProducts');
    expect(response.body).toHaveProperty('currentPage');
  })
})