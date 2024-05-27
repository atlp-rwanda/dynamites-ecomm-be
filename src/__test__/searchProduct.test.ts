import request from 'supertest';
import app from '../app';
import { beforeAllHook, afterAllHook, getBuyerToken } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Search Products Controller Test', () => {
  let buyerToken: string;

  beforeAll(async () => {
    buyerToken = await getBuyerToken();
  });

  it('should search products with keyword', async () => {
    
    const response = await request(app)
      .get('/api/v1/search?keyword=keyword')
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it('should search products by category', async () => {
    const response = await request(app)
      .get('/api/v1/search?category=categoryName')
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it('should search products by product name', async () => {
    const response = await request(app)
      .get('/api/v1/search?productName=productName')
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined(); 
  });

  it('should search products and apply sorting', async () => {
    const response = await request(app)
      .get('/api/v1/search?sort=asc')
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
});