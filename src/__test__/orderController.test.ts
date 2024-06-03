import request from 'supertest';
import app from '../app';
import { Order } from '../database/models/orderEntity';
import { afterAllHook, beforeAllHook } from './testSetup';
import dbConnection from '../database';

const orderRepository = dbConnection.getRepository(Order);

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Order Routes', () => {
  describe('PUT /order/:orderId', () => {
    it('should update order status to Failed', async () => {
      const order = orderRepository.create({
        status: 'Pending',
        totalAmount: 40,
        trackingNumber: '34343653',
      });
      await orderRepository.save(order);

      const response = await request(app)
        .put(`/api/v1/order/${order.id}`)
        .send({ status: 'Failed' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ msg: 'Order status updated to Failed' });
    });

    it('should return 400 if orderId is invalid', async () => {
      const response = await request(app)
        .put('/api/v1/order/invalid')
        .send({ status: 'Failed' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ msg: 'Invalid orderId' });
    });

    it('should return 400 if status is invalid', async () => {
      const order = orderRepository.create({
        status: 'Pending',
        totalAmount: 40,
        trackingNumber: '34343653',
      });
      await orderRepository.save(order);

      const response = await request(app)
        .put(`/api/v1/order/${order.id}`)
        .send({ status: 'InvalidStatus' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ msg: 'Invalid status' });
    });

    it('should return 404 if order is not found', async () => {
      const response = await request(app)
        .put('/api/v1/order/9999')
        .send({ status: 'Failed' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ msg: 'Order Not Found' });
    });

    it('should return 500 if there is a server error', async () => {
      jest
        .spyOn(orderRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/v1/order/1')
        .send({ status: 'Failed' });

      expect(response.status).toBe(500);
    });
  });
});
