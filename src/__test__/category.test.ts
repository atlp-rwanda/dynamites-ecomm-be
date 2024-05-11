import request from 'supertest';
import app from '../app';
import Category from '../database/models/categoryEntity';
import dbConnection from '../database';
import { afterAllHook, beforeAllHook } from './testSetup';


beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Category Creation Tests', () => {
  it('should create a new category with valid data', async () => {
    const categoryData = {
      name: 'Test Category',
      description: 'Test category description',
    };

    const response = await request(app)
      .post('/api/v1/category')
      .send(categoryData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Category successfully created');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name', categoryData.name);
    expect(response.body.data).toHaveProperty('description', categoryData.description);
  });

  it('should return a 400 status code if name is missing', async () => {
    const invalidData = {
      description: 'Test category description',
    };

    const response = await request(app)
      .post('/api/v1/category')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('Category name is required');
  });

  it('should return a 409 status code if category name already exists', async () => {
    // Create a category with the same name
    const existingCategoryData = {
      name: 'Existing Category',
      description: 'Existing category description',
    };
    await request(app)
      .post('/api/v1/category')
      .send(existingCategoryData);

      const newCategoryData = {
        name: 'Existing Category',
        description: 'Existing category description',
      };
      const response = await request(app)
        .post('/api/v1/category')
        .send(newCategoryData);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Category name already exists');
  });
});
