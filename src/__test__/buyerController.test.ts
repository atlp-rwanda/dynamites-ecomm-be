import request from 'supertest';
import app from '../app';
import {
  afterAllHook,
  beforeAllHook,
  getBuyerToken,
  getVendorToken,
} from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Buyer Controller test', () => {
  let buyerToken: string;
  let vendorToken: string;
  let productId: number;
  let categoryId: number;

  beforeAll(async () => {
    buyerToken = await getBuyerToken();
    vendorToken = await getVendorToken();
  });

  it('should get a product by id', async () => {
    // create a category
    const categoryData = {
      name: 'Category4',
      description: 'category description',
    };

    const categoryResponse = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send(categoryData);

    categoryId = categoryResponse.body.data.id;

    const productData = {
      name: 'New Product Two',
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
      .set('Authorization', `Bearer ${vendorToken}`)
      .send(productData);

    productId = response.body.data.id;

    const getResponse = await request(app)
      .get(`/api/v1/buyer/get_product/${productId}`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(getResponse.statusCode).toEqual(200);
    expect(getResponse.body.msg).toEqual('Product retrieved successfully');
  });

  it('should return a 404 if product is not found', async () => {
    const response = await request(app)
      .get('/api/v1/buyer/get_product/5')
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Product not found');
  });
});
