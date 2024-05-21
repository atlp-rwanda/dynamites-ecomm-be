import { Request, Response } from 'express';
import dbConnection from '../database';
import Product from '../database/models/productEntity';
import Category from '../database/models/categoryEntity';
import errorHandler from '../middlewares/errorHandler';

const productRepository = dbConnection.getRepository(Product);
const categoryRepository = dbConnection.getRepository(Category);

export const searchProducts = errorHandler(
  async (req: Request, res: Response) => {
    const { keyword, category, productName, sort } = req.query;

    let queryBuilder = productRepository.createQueryBuilder('product');

    if (keyword) {
      queryBuilder = queryBuilder.andWhere(
        'product.name ILIKE :keyword OR product.shortDesc ILIKE :keyword OR product.longDesc ILIKE :keyword',
        { keyword: `%${keyword}%` }
      );
    }

    if (category) {
      const categoryEntity = await categoryRepository.findOne({
        where: { name: category as string },
      });
      if (categoryEntity) {
        queryBuilder = queryBuilder.andWhere(
          'product.categoryId = :categoryId',
          { categoryId: categoryEntity.id }
        );
      }
    }

    if (productName) {
      queryBuilder = queryBuilder.andWhere('product.name ILIKE :productName', {
        productName: `%${productName}%`,
      });
    }

    if (sort) {
      const sortDirection = sort.toString().toUpperCase() as 'ASC' | 'DESC';
      queryBuilder = queryBuilder.orderBy('product.salesPrice', sortDirection);
    }

    const total = await queryBuilder.getCount();
    const products = await queryBuilder.getMany();

    return res.status(200).json({
      data: products,
      total,
    });
  }
);
