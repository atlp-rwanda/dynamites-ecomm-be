import request from 'supertest';
import app from '../app';
import { getVendorToken, afterAllHook, beforeAllHook } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Product Controller Tests', () => {
  let token: string;
  let productId: number;
  let categoryId: number;

  beforeAll(async () => {
    token = await getVendorToken();
  });

  it('should create a new product with valid data', async () => {
    // create a category
    const categoryData = {
      name: 'Category',
      description: 'category description',
    };

    const categoryResponse = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .send(categoryData);

    categoryId = categoryResponse.body.data.id;

    const productData = {
      name: 'New Product',
      image: 'new_product.jpg',
      gallery: [],
      shortDesc: 'This is a new product',
      longDesc: 'Detailed description of the new product',
      categoryId: categoryId,
      quantity: 10,
      regularPrice: 5,
      salesPrice: 4,
      tags: ['tag1', 'tag2'],
      type: 'Simple',
      isAvailable: true,
    };

    const response = await request(app)
      .post('/api/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send(productData);
    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual('Product successfully created');
    expect(response.body.data).toBeDefined();
    productId = response.body.data.id;
  });

  it('should retrieve all products', async () => {
    const response = await request(app).get('/api/v1/product');

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Data retrieved successfully');
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  it('should retrieve a single product by ID', async () => {
    const response = await request(app)
      .get(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Data retrieved successfully');
    expect(response.body.data).toBeDefined();
  });

  it('should update a product by ID', async () => {
    const updatedProductData = {
      name: 'Updated Product Name',
      image: 'Updated.jpg',
      gallery: [],
      shortDesc: 'This is a updated',
      longDesc: 'Detailed description of the Updated product',
      categoryId: categoryId,
      quantity: 3,
      regularPrice: 10,
      salesPrice: 7,
      tags: ['tag1', 'tag2'],
      type: 'Variable',
      isAvailable: true,
    };

    const response = await request(app)
      .put(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProductData);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Product successfully updated');
    expect(response.body.data).toBeDefined();
  });

  it('should delete a product by ID', async () => {
    const response = await request(app)
      .delete(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Product deleted successfully');
  });

  it('should delete all products', async () => {
    const response = await request(app)
      .delete('/api/v1/product')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('All product deleted successfully');
  });
});
