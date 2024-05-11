import { Request, Response } from 'express';
import Product from '../database/models/productEntity';
import dbConnection from '../database';

const productRepository = dbConnection.getRepository(Product);

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const users = await productRepository.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
