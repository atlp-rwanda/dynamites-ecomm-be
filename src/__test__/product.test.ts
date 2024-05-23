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

  it('should return 409 if product name already exists', async () => {
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

    expect(response.statusCode).toEqual(409);
    expect(response.body.message).toEqual('Product name already exists');
  });

  it('should return 404 if category not found', async () => {
    const nonExistentCategoryId = 999;

    const productData = {
      name: 'Test Product',
      image: 'test.jpg',
      gallery: [],
      shortDesc: 'A test product',
      longDesc: 'Description of a test product',
      categoryId: nonExistentCategoryId,
      quantity: 10,
      regularPrice: 20,
      salesPrice: 18,
      tags: ['tag1', 'tag2'],
      type: 'Simple',
      isAvailable: true,
    };

    const response = await request(app)
      .post('/api/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send(productData);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Category not found');
  });

  it('should return validation errors for invalid product data', async () => {
    const invalidProductData = {
      name: '',
      image: '',
    };
    const response = await request(app)
      .post('/api/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidProductData);
    expect(response.statusCode).toEqual(400);
    expect(response.body.errors).toBeDefined();
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

  it('should return a 404 for a non-existent product while updating', async () => {
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
    const nonExistentProductId = -999;
    const response = await request(app)
      .put(`/api/v1/product/${nonExistentProductId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProductData);

    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual('Product not found');
  });

  it('should return 404 if category not found while updating', async () => {
    const nonExistentCategoryId = 999;

    const productData = {
      name: 'Test Product',
      image: 'test.jpg',
      gallery: [],
      shortDesc: 'A test product',
      longDesc: 'Description of a test product',
      categoryId: nonExistentCategoryId,
      quantity: 10,
      regularPrice: 20,
      salesPrice: 18,
      tags: ['tag1', 'tag2'],
      type: 'Simple',
      isAvailable: true,
    };

    const response = await request(app)
      .put(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(productData);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Category not found');
  });
  it('should return a 404 for a non-existent product', async () => {
    const nonExistentProductId = -999;
    const response = await request(app)
      .get(`/api/v1/product/${nonExistentProductId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual('Product not found');
  });

  it('should return validation errors for invalid update data', async () => {
    const invalidUpdateData = {
      name: '',
    };
    const response = await request(app)
      .put(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidUpdateData);
    expect(response.statusCode).toEqual(400);
    expect(response.body.errors).toBeDefined();
  });
  it('should update product availability', async () => {
    const availabilityData = {
      availability: false,
    };

    const response = await request(app)
      .put(`/api/v1/product/${productId}/availability`)
      .set('Authorization', `Bearer ${token}`)
      .send(availabilityData);

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Product availability updated');
  });

  it('should return product availability', async () => {
    const response = await request(app)
      .get(`/api/v1/product/${productId}/availability`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.availability).toBeDefined();
    expect(response.body.productId).toBe(`${productId}`);
  });

  it('should update availability based on quantity', async () => {
    const zero = 0
    const nonZero = 3
    const zeroQuantity = {
      name: 'Updated Product Name',
      image: 'Updated.jpg',
      gallery: [],
      shortDesc: 'This is a updated',
      longDesc: 'Detailed description of the Updated product',
      categoryId: categoryId,
      quantity: zero,
      regularPrice: 10,
      salesPrice: 7,
      tags: ['tag1', 'tag2'],
      type: 'Variable',
      isAvailable: true,
    };
    const nonZeroQuantity = {...zeroQuantity, quantity: nonZero}
    const response = await request(app)
      .put(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(zeroQuantity);

    expect(response.body.data.isAvailable).toEqual(false);

    const response2 = await request(app)
      .put(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(nonZeroQuantity);

    expect(response2.body.data.isAvailable).toEqual(true);
  });

  it('should return validation errors for invalid availability data', async () => {
    const invalidUpdateData = {
      name: '',
    };
    const response = await request(app)
      .put(`/api/v1/product/${productId}/availability`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidUpdateData);
    expect(response.statusCode).toEqual(400);
    expect(response.body.errors).toBeDefined();
  });
  it('should return 401 if user is not found', async () => {
    const nonExistentUserId = 9999;

    const response = await request(app)
      .get(`/api/v1/product/${productId}/availability`)
      .set('Authorization', `Bearer ${nonExistentUserId}`);

    expect(response.status).toBe(401);
  });

  it('should return 404 if product is not found', async () => {
    const nonExistentProductId = 9999;

    const response = await request(app)
      .get(`/api/v1/product/${nonExistentProductId}/availability`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Product not found');
  });

  it('should return 403 if product is not owned by vendor', async () => {
    // Create a user with a different ID
    const otherToken = await getVendorToken(
      'test2@gmail.com',
      'TestPassword123',
      'Test2',
      'User2'
    );

    const response = await request(app)
      .get(`/api/v1/product/${productId}/availability`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(403);
    expect(response.body.msg).toBe('Product not owned by vendor');
  });
  it('should delete a product by ID', async () => {
    const response = await request(app)
      .delete(`/api/v1/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('Product deleted successfully');
  });

  it('should return a 404 for a non-existent product', async () => {
    const nonExistentProductId = -999;
    const response = await request(app)
      .delete(`/api/v1/product/${nonExistentProductId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual('Product Not Found');
  });

  it('should delete all products', async () => {
    const response = await request(app)
      .delete('/api/v1/product')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual('All product deleted successfully');
  });

  it('should retrieve recommended products', async () => {
    const productData = {
      name: 'Seasonal Product',
      image: 'seasonal_product.jpg',
      gallery: [],
      shortDesc: 'This is a seasonal product',
      longDesc: 'Detailed description of the seasonal product',
      categoryId: categoryId,
      quantity: 10,
      regularPrice: 5,
      salesPrice: 4,
      tags: ['Summer'],
      type: 'Simple',
      isAvailable: true,
    };

    await request(app)
      .post('/api/v1/product')
      .set('Authorization', `Bearer ${token}`)
      .send(productData);

    const response = await request(app).get('/api/v1/product/recommended');
    expect(response.statusCode).toEqual(200);

    expect(response.body.message).toEqual(
      'Recommended products retrieved successfully'
    );

    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.data[0].tags).toContain('Summer');
  });

  it('should retrieve all available products', async () => {
    const response = await request(app).get(
      '/api/v1/product/getAvailableProducts'
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('availableProducts');
    expect(response.body).toHaveProperty('totalPages');
    expect(response.body).toHaveProperty('currentPage');
    expect(response.header['content-type']).toEqual(
      expect.stringContaining('json')
    );
  });

  it('should parse limit and page from query parameters', async () => {
    const limit = 5;
    const page = 1;
    const response = await request(app).get(
      `/api/v1/product/getAvailableProducts?limit=${limit}&page=${page}`
    );

    expect(response.status).toBe(200);
    expect(response.body.currentPage).toBe(page);
    expect(response.body).toHaveProperty('availableProducts');
    expect(response.body.availableProducts.length).toBeLessThanOrEqual(limit);
  });
});
