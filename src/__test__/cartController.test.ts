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

describe('Cart controller tests', () => {
  let buyerToken: string;
  let vendorToken: string;
  let productId: number;
  let itemId: number;
  let categoryId: number;

  beforeAll(async () => {
    buyerToken = await getBuyerToken();
    vendorToken = await getVendorToken();
  });

  it('should return cart items and total amount for  user', async () => {
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

    const responseProduct = await request(app)
      .post('/api/v1/product')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send(productData);

    productId = responseProduct.body.data.id;

    const response = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.cartItems).toBeDefined();
    expect(response.body.totalAmount).toBeDefined();
  });

  it('should add an item to the cart successfully', async () => {
    const response = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        productId: productId,
        quantity: 2,
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.msg).toEqual('Item added to cart successfully');
    expect(response.body.cartItem).toBeDefined();
    itemId = response.body.cartItem.id;
  });

  it('should return a 404 if product is not found', async () => {
    const invalidProduct = 0;
    const response = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        productId: invalidProduct,
        quantity: 2,
      });
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Product or User not found');
  });

  it('should return 409 if quantity is less than or equal to zero', async () => {
    const response = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        productId: productId,
        quantity: 0,
      });

    expect(response.statusCode).toEqual(409);
    expect(response.body.msg).toEqual('Invalid Quantity');
  });

  it('should return 409 if quantity exceeds available quantity while adding to cart', async () => {
    const response = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        productId: productId,
        quantity: 50000,
      });

    expect(response.statusCode).toEqual(409);
    expect(response.body.msg).toEqual('Quantity exceeds available quantity');
  });

  it('should update the quantity of an item in the cart successfully', async () => {
    const newQuantity = 3;
    const response = await request(app)
      .patch(`/api/v1/cart/${itemId}`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        quantity: newQuantity,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('Quantity successfully updated');
  });

  it('should return a 404 if Cart item is not found', async () => {
    const newQuantity = 3;
    const invalidItem = 9999;
    const response = await request(app)
      .patch(`/api/v1/cart/${invalidItem}`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        quantity: newQuantity,
      });

    expect(response.statusCode).toEqual(404);
    expect(response.body.msg).toEqual('Item not found');
  });

  it('should return 409 if quantity is less than or equal to zero', async () => {
    const invalidQuantity = 0;
    const response = await request(app)
      .patch(`/api/v1/cart/${itemId}`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        quantity: invalidQuantity,
      });

    expect(response.statusCode).toEqual(409);
    expect(response.body.msg).toEqual('Invalid Quantity');
  });
  it('should return 409 if quantity exceeds available quantity while ugating a cart', async () => {
    const exceedQuantity = 50000;
    const response = await request(app)
      .patch(`/api/v1/cart/${itemId}`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        quantity: exceedQuantity,
      });

    expect(response.statusCode).toEqual(409);
    expect(response.body.msg).toEqual('Quantity exceeds available quantity');
  });

  it('should return 404 if item not found', async () => {
    const nonExistentItemId = 9999;
    const response = await request(app)
      .delete(`/api/v1/cart/${nonExistentItemId}`)
      .set('Authorization', `Bearer ${buyerToken}`);
    expect(response.statusCode).toEqual(404);
    expect(response.body.msg).toEqual('Item not found');
  });

  it('should remove an item from the cart successfully', async () => {
    const response = await request(app)
      .delete(`/api/v1/cart/${itemId}`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('Cart Item deleted successfully');
    expect(response.body.count).toBeGreaterThan(0);
  });
  it('should remove all items from the cart successfully', async () => {
    const response = await request(app)
      .delete('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('Cart Items deleted successfully');
    expect(response.body.count).toBeGreaterThanOrEqual(0);
  });
});
