import { Request, Response } from 'express';
import dbConnection from '../database';
import Product from '../database/models/productEntity';
import errorHandler from '../middlewares/errorHandler';
import Stripe from 'stripe';
import { Order } from '../database/models/orderEntity';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-04-10' });
const productRepository = dbConnection.getRepository(Product);
const orderRepository = dbConnection.getRepository(Order);



export const getOneProduct = errorHandler(
  async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
 
 
    const product = await productRepository.findOne({
      where: { id: productId },
      relations: ['category'],
    });
 
 
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
 
 
    return res
      .status(200)
      .json({ msg: 'Product retrieved successfully', product });
  }
 );
 
 
 
 
 export const handlePayment = errorHandler(
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
 
 
    const order = await orderRepository.findOne({ where: { id: orderId } });
 
 
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
 
 
    if (order.paid) {
      return res.status(400).json({ success: false, message: 'Order has already been paid' });
    }
 
 
    const amountInCents = order.totalAmount * 100;
 
 
    const charge = await stripe.charges.create({
      amount: amountInCents,
      currency: 'usd',
      description: 'Test Charge',
      source: token,
    });
 
 
    order.paid = true;
    await orderRepository.save(order);
 
    return res.status(200).json({ success: true, paid: true, charge});
  }
 );
 