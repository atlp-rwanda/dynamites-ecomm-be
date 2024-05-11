import { Request, Response } from 'express';
import Product from '../database/models/productEntity';
import dbConnection from '../database';

const productRepository = dbConnection.getRepository(Product);

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepository.find();
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
