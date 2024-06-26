import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook, getVendorToken } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Category Creation Tests', () => {
  beforeAll(async () => {
    token = await getVendorToken();
  });
  let token: string;
  let categoryId: number;

  it('should create a new category with valid data', async () => {
    const categoryData = {
      name: 'Test Category',
      description: 'Test category description',
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
    };

    const response = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('Category name is required');
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
    };
    await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(existingCategoryData);

    const newCategoryData = {
      name: 'Existing Category',
      description: 'Existing category description',
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
    };
    await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(existingCategoryData);

    const updateCategoryData = {
      name: 'Existing Category',
      description: 'Existing category description',
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
});
