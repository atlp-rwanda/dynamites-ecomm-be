import request from 'supertest';
import app from '../app'; // Adjust the import based on your project structure
import { getBuyerToken } from './testSetup'; // Adjust the import based on your project structure
import { Order } from '../database/models/orderEntity';
import dbConnection from '../database';
import Stripe from 'stripe';


jest.mock('stripe');
const MockedStripe = Stripe as jest.Mocked<typeof Stripe>;


describe('handlePayment', () => {
 let token: string;
 let order: Order;


 beforeAll(async () => {
   await dbConnection.initialize();
   await dbConnection.synchronize(true); // This will drop all tables
   token = await getBuyerToken();
   // Create a mock order in the database
   const orderRepository = dbConnection.getRepository(Order);
   order = orderRepository.create({
     totalAmount: 100,
     status: 'Pending',
     trackingNumber: '123456',
     paid: false,
   });
   await orderRepository.save(order);
 });


 afterAll(async () => {
   await dbConnection.close();
 });


 it('should process payment successfully', async () => {
   const mockChargesCreate = jest.fn().mockResolvedValue({
     id: 'charge_id',
     amount: 10000,
     currency: 'usd',
   } as Stripe.Charge);


   MockedStripe.prototype.charges = {
     create: mockChargesCreate,
   } as unknown as Stripe.ChargesResource;


   const response = await request(app)
     .post('/api/v1/buyer/payment')
     .set('Authorization', `Bearer ${token}`)
     .send({ token: 'fake-token', orderId: order.id });


   expect(response.status).toBe(200);
   expect(response.body.success).toBe(true);
   expect(response.body.paid).toBe(true);
   expect(response.body.charge.id).toBe('charge_id');
   expect(mockChargesCreate).toHaveBeenCalledWith({
     amount: 10000,
     currency: 'usd',
     description: 'Test Charge',
     source: 'fake-token',
   });
 });


 it('should return 404 if order not found', async () => {
   const response = await request(app)
     .post('/api/v1/buyer/payment')
     .set('Authorization', `Bearer ${token}`)
     .send({ token: 'fake-token', orderId: 999 });


   expect(response.status).toBe(404);
   expect(response.body.success).toBe(false);
   expect(response.body.message).toBe('Order not found');
 });


 it('should return 400 if order already paid', async () => {
   // Set the order as paid
   const orderRepository = dbConnection.getRepository(Order);
   order.paid = true;
   await orderRepository.save(order);


   const response = await request(app)
     .post('/api/v1/buyer/payment')
     .set('Authorization', `Bearer ${token}`)
     .send({ token: 'fake-token', orderId: order.id });


   expect(response.status).toBe(400);
   expect(response.body.success).toBe(false);
   expect(response.body.message).toBe('Order has already been paid');
 });
});
