import request from 'supertest';
import app from '../app';
import {
  afterAllHook,
  beforeAllHook,
  getBuyerToken,
  getVendorToken,
} from './testSetup';
import {Cart} from '../database/models/cartEntity'
import dbConnection from '../database';
const cartRepository =dbConnection.getRepository(Cart)
beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Cart controller tests', () => {
  let buyerToken: string;
  let vendorToken: string;
  let productId: number;
  let itemId: number;
  let categoryId: number;
  let orderId: number;

  beforeAll(async () => {
    buyerToken = await getBuyerToken();
    vendorToken = await getVendorToken();
  });

  it('should return cart items and total amount for the user', async () => {
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

  it('should return 409 if quantity exceeds available quantity while updating a cart', async () => {
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

  // New tests for checkout, cancel checkout, and get all orders

  it('should place an order successfully', async () => {
    const cartResponse = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        productId: productId,
        quantity: 2,
      });

    expect(cartResponse.statusCode).toEqual(201);
    expect(cartResponse.body.msg).toEqual('Item added to cart successfully');
    expect(cartResponse.body.cartItem).toBeDefined();

    const checkoutResponse = await request(app)
      .post('/api/v1/checkout')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        deliveryInfo: '123 Delivery St.',
        paymentInfo: 'VISA 1234',
        couponCode: 'DISCOUNT10',
      });

    expect(checkoutResponse.statusCode).toEqual(201);
    expect(checkoutResponse.body.msg).toEqual('Order placed successfully');
    expect(checkoutResponse.body.order).toBeDefined();
    expect(checkoutResponse.body.trackingNumber).toBeDefined();
    orderId = checkoutResponse.body.order.id;
  });

  it('should cancel an order successfully', async () => {
    const response = await request(app)
      .delete(`/api/v1/checkout/cancel-order/${orderId}`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('Order canceled successfully');
  });

  it('should return 404 if order is not found while canceling', async () => {
    const nonExistentOrderId = 9999;
    const response = await request(app)
      .delete(`/api/v1/checkout/cancel-order/${nonExistentOrderId}`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.msg).toEqual('Order not found');
  });


  it('should return 401 if user is not found while checking out', async () => {
    // Simulate a request with a non-existent user ID
    const invalidUserToken = 'Bearer invalid-user-token';
  
    const response = await request(app)
      .post('/api/v1/checkout')
      .set('Authorization', invalidUserToken)
      .send({
        deliveryInfo: '123 Delivery St.',
        paymentInfo: 'VISA 1234',
        couponCode: 'DISCOUNT10',
      });
  
    expect(response.statusCode).toEqual(401);
    expect(response.body.msg).toBeUndefined();
  });
  
  

  
  it('should return all orders', async () => {
    const response = await request(app)
      .get('/api/v1/checkout/getall-order')
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.orders).toBeDefined();
  });




  it('should return 400 if cart is empty while checking out', async () => {
    // Clear the cart before attempting to checkout
    await cartRepository.delete({});
  
    const response = await request(app)
      .post('/api/v1/checkout')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        deliveryInfo: '123 Delivery St.',
        paymentInfo: 'VISA 1234',
        couponCode: 'DISCOUNT10',
      });
  
    expect(response.statusCode).toEqual(400);
    expect(response.body.msg).toEqual('Cart is empty');
  });
  

  it('should delete all orders', async () => {
    const response = await request(app)
     .delete('/api/v1/checkout/removeall-order')
     .set('Authorization', `Bearer ${buyerToken}`);
  
    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('All orders deleted successfully');
  });
  
});
