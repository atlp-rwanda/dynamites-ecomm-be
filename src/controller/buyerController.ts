import { Request, Response } from 'express';
import dbConnection from '../database';
import Product from '../database/models/productEntity';
import errorHandler from '../middlewares/errorHandler';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });
const productRepository = dbConnection.getRepository(Product);

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
    const { token, amount } = req.body;

    // Convert amount in dollars to cents
    const amountInCents = amount * 100;

    const charge = await stripe.charges.create({
      amount: amountInCents,
      currency: 'usd',
      description: 'Test Charge',
      source: token,
    });

    return res.status(200).json({ success: true, charge });
  }
);
 