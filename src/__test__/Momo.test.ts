import { Response } from 'node-fetch';
import fetch from 'node-fetch';
import request from 'supertest';
import app from '../app';
import { getBuyerToken } from './testSetup';
import { Order } from '../database/models/orderEntity';
import dbConnection from '../database';

jest.mock('node-fetch');

// Mocking the response for requestToPay function

interface Ibody {
  apiKey?: string;
  access_token?: string;
  result?: boolean;
  status?: string;
}

const mockRequestToPayResponse = (status: number, body: Ibody) => {
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status })
  );
};

// Mocking the response for requestToPayStatus function
const mockRequestToPayStatusResponse = (status: number, body: Ibody) => {
  (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status })
  );
};

describe('Buyer Controller Tests', () => {
  let token: string;
  let order: Order;
  let requestId: string;

  beforeAll(async () => {
    await dbConnection.initialize();
    await dbConnection.synchronize(true);
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

  describe('MomohandlePayment', () => {
    it('should handle mobile money payment successfully', async () => {
      mockRequestToPayResponse(200, { apiKey: 'fake-api-key' });
      mockRequestToPayResponse(200, { access_token: 'fake-access-token' });
      mockRequestToPayResponse(200, { result: true });
      mockRequestToPayResponse(202, {});
      const response = await request(app)
        .post('/api/v1/buyer/momoPay')
        .set('Authorization', `Bearer ${token}`)
        .send({ orderId: order.id, momoNumber: '123456789' });

      requestId = response.body.requestId;

      expect(response.status).toBe(202);
      expect(response.body.message).toBe('Transaction Accepted');
      expect(response.body.requestId).toBeDefined();
    });

    it('should return 400 if MoMo number is invalid', async () => {
      mockRequestToPayResponse(200, { apiKey: 'fake-api-key' });
      mockRequestToPayResponse(200, { access_token: 'fake-access-token' });
      mockRequestToPayResponse(200, { result: false });

      const response = await request(app)
        .post('/api/v1/buyer/momoPay')
        .set('Authorization', `Bearer ${token}`)
        .send({ orderId: order.id, momoNumber: 'invalid-number' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Your Momo Number does not Exist');
    });

    it('should return 404 if order not found', async () => {
      const response = await request(app)
        .post('/api/v1/buyer/momoPay')
        .set('Authorization', `Bearer ${token}`)
        .send({ orderId: 999, momoNumber: '123456789' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });

    it('should return 400 if order already paid', async () => {
      const orderRepository = dbConnection.getRepository(Order);
      order.paid = true;
      await orderRepository.save(order);

      const response = await request(app)
        .post('/api/v1/buyer/momoPay')
        .set('Authorization', `Bearer ${token}`)
        .send({ orderId: order.id, momoNumber: '123456789' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order has already been paid');
    });
  });

  describe('checkPaymentStatus', () => {
    it('should update order status successfully', async () => {
      mockRequestToPayResponse(200, { apiKey: 'fake-api-key' });
      mockRequestToPayResponse(200, { access_token: 'fake-access-token' });
      mockRequestToPayStatusResponse(200, { status: 'SUCCESSFUL' });

      const response = await request(app)
        .post(`/api/v1/buyer/getPaymentStatus/${order.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ requestId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Transaction Done Successfully');
    });

    it('should return 404 if order not found', async () => {
      const response = await request(app)
        .post('/api/v1/buyer/getPaymentStatus/99')
        .set('Authorization', `Bearer ${token}`)
        .send({ requestId: 'valid-request-id' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Order not found');
    });

    it('should return 400 if transaction failed', async () => {
      mockRequestToPayResponse(400, { apiKey: 'fake-api-key' });
      mockRequestToPayResponse(400, { access_token: 'fake-access-token' });
      mockRequestToPayStatusResponse(400, {
        status: 'FAILED',
      });

      const response = await request(app)
        .post(`/api/v1/buyer/getPaymentStatus/${order.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ requestId });

      expect(response.status).toBe(200);
    });
  });
});
