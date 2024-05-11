import { Request, Response } from 'express';
import dbConnection from '../database';
import Category from '../database/models/categoryEntity';

const categoryRepository = dbConnection.getRepository(Category);

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepository.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
