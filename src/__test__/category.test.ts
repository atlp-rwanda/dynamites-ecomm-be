import request from 'supertest';
import app from '../app';
import {
  afterAllHook,
  beforeAllHook,
  getAdminToken,
  getVendorToken,
} from './testSetup';
import { Order } from '../database/models/orderEntity';
import dbConnection from '../database';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Category Creation Tests', () => {
  beforeAll(async () => {
    token = await getVendorToken();
    adminToken = await getAdminToken();
  });
  let token: string;
  let categoryId: number;
  let adminToken: string;

  it('should create a new category with valid data', async () => {
    const categoryData = {
      name: 'Test Category',
      description: 'Test category description',
      icon: 'Test category icon',
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
    categoryId = response.body.data.id;
  });

  it('should return a 400 status code if name is missing', async () => {
    const invalidData = {
      description: 'Test category description',
      icon: 'Test category icon',
    };

    const response = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('Category name is required');
  });

  it('should return a 400 status code if icon is missing', async () => {
    const invalidData = {
      description: 'Test category description',
      name: 'Test category name',
    };

    const response = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('Category icon is required');
  });

  it('should return 400 if request data is invalid', async () => {
    const invalidData = {};

    const response = await request(app)
      .put(`/api/v1/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should return a 409 status code if category name already exists', async () => {
    const existingCategoryData = {
      name: 'Existing Category',
      description: 'Existing category description',
      icon: 'Existing category icon',
    };
    await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(existingCategoryData);

    const newCategoryData = {
      name: 'Existing Category',
      description: 'Existing category description',
      icon: 'Existing category icon',
    };
    const response = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(newCategoryData);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Category name already exists');
  });

  it('should return all categories with status 200', async () => {
    const response = await request(app).get('/api/v1/category');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data retrieved successfully');
    expect(response.body.data).toBeDefined;
  });

  it('should return a category by ID with status 200', async () => {
    const response = await request(app).get(`/api/v1/category/${categoryId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Data retrieved successfully');
    expect(response.body.data).toBeDefined;
  });

  it('should return 404 if category is not found', async () => {
    const nonExistentCategoryId = 9999;

    const response = await request(app).get(
      `/api/v1/category/${nonExistentCategoryId}`
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Category Not Found');
  });

  it('should update the category with status 200', async () => {
    const updatedCategoryData = {
      name: 'Updated Category Name',
      description: 'Updated category description',
      icon: 'Updated category icon',
    };

    const response = await request(app)
      .put(`/api/v1/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedCategoryData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Category successfully updated');
    expect(response.body.data.name).toBe(updatedCategoryData.name);
    expect(response.body.data.description).toBe(
      updatedCategoryData.description
    );
  });

  it('should return a 409 status code if category update name already exists', async () => {
    const existingCategoryData = {
      name: 'Existing Category',
      description: 'Existing category description',
      icon: 'Existing category icon',
    };
    await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(existingCategoryData);

    const updateCategoryData = {
      name: 'Existing Category',
      description: 'Existing category description',
      icon: 'Existing category icon',
    };
    const response = await request(app)
      .put(`/api/v1/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateCategoryData);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Category name already exists');
  });

  it('should return 404 if category is not found', async () => {
    const response = await request(app)
      .put('/api/v1/category/9999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Category Name',
        description: 'Updated category description',
        icon: 'Updated category icon',
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Category Not Found');
  });

  it('should delete the category with status 200', async () => {
    const response = await request(app)
      .delete(`/api/v1/category/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Category deleted successfully');
  });

  it('should return 404 if category is not found', async () => {
    const response = await request(app)
      .delete('/api/v1/category/9999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Category Not Found');
  });

  it('should return an array of category metrics', async () => {
    const response = await request(app)
      .get('/api/v1/category/get_metrics')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
  it('should return an array of sales by counrty', async () => {
    // Create a mock order in the database
    const orderRepository = dbConnection.getRepository(Order);
    const order = orderRepository.create({
      totalAmount: 100,
      country: 'RW',
      status: 'Pending',
      trackingNumber: '123456',
      paid: true,
    });
    await orderRepository.save(order);

    const response = await request(app)
      .get('/api/v1/category/getSalesByCountry')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.counter).toBeDefined();
  });
});
