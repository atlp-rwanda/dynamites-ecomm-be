import request from 'supertest';
import app from '../app';
import { getVendorToken, afterAllHook, beforeAllHook } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('get /api/v1/getAvailableProducts', ()=>{

  let token: string;

  beforeAll(async () => {
    token = await getVendorToken();
  });

  it('should retrieve all available products', async () => {
    const response = await request(app).get('/api/v1/getAvailableProducts');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('availableProducts');
    expect(response.body).toHaveProperty('totalPages');
    expect(response.body).toHaveProperty('currentPage');
    expect(response.header['content-type']).toEqual(expect.stringContaining('json'));
  });
})