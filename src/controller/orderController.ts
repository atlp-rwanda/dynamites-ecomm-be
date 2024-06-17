import { Request, Response } from 'express';
import dbConnection from '../database';
import errorHandler from '../middlewares/errorHandler';
import { Order } from '../database/models/orderEntity';
import {eventEmitter} from '../Notification.vendor/event.services'
const orderRepository = dbConnection.getRepository(Order);

export const updateOrderStatus = errorHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const numericOrderId = parseInt(orderId, 10);
    if (isNaN(numericOrderId)) {
      return res.status(400).json({ msg: 'Invalid orderId' });
    }

    const validStatuses = [
      'Pending',
      'Failed',
      'Canceled',
      'Paid',
      'Shipping',
      'Delivered',
      'Returned',
      'Completed',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const order = await orderRepository.findOne({
      where: {
        id: numericOrderId,
      },
    });

    if (!order) {
      return res.status(404).json({ msg: 'Order Not Found' });
    }

    order.status = status;

    await orderRepository.save(order);

    eventEmitter.emit('order_status_change',order.id)
    
    return res
      .status(200)
      .json({ msg: `Order status updated to ${order.status}` });
  }
);
