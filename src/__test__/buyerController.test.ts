import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('RoleController test', () => {
    it('should return a 404 if product is not found', async () => {
        const response = await request(app).get('/api/v1/buyer/get_product/5')
        expect(response.status).toBe(404)
        expect(response.body.msg).toBe("Product not found")
    })
})
  