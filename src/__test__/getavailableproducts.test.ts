import request from 'supertest';
import app from '../app'

describe('GET /api/v1/product/getAvailableProducts', () => {
  it('should return status 200 with available products', async () => {
    const response = await request(app).get('/api/v1/product/getAvailableProducts');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('availableProducts');
    expect(response.body).toHaveProperty('totalPages');
    expect(response.body).toHaveProperty('currentPage');
  });

});