import request from 'supertest';
import app from '../app';
import { beforeAllHook } from './globalConfig';

beforeAll(beforeAllHook);

describe('The Dynamites backend e-commerce Tests', () => {
  it('responds with welcome message on /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Welcome To The Dynamites backend e-commerce'
    );
  });
});
