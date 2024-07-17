import { Request, Response } from 'express';
import dbConnection from '../database';
import Product from '../database/models/productEntity';
import errorHandler from '../middlewares/errorHandler';
import { SelectQueryBuilder } from 'typeorm';

const productRepository = dbConnection.getRepository(Product);

interface searchParams {
  keyword?: string;
  category?: number[];
  productName?: string;
  rating?: number[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const paginate = (
  query: SelectQueryBuilder<Product>,
  page: number,
  limit: number
) => {
  return query.skip((page - 1) * limit).take(limit);
};

export const searchProducts = errorHandler(
  async (req: Request, res: Response) => {
    const {
      keyword,
      category,
      productName,
      rating,
      minPrice,
      maxPrice,
      sort = 'DESC',
      page = 1,
      limit = 9,
    }: searchParams = req.query;

    let queryBuilder = productRepository.createQueryBuilder('product');

    if (keyword) {
      queryBuilder = queryBuilder.andWhere(
        'product.name ILIKE :keyword OR product.shortDesc ILIKE :keyword OR product.longDesc ILIKE :keyword',
        { keyword: `%${keyword}%` }
      );
    }

    if (category && category.length > 0) {
      queryBuilder = queryBuilder.andWhere(
        'product.categoryId IN (:...category)',
        { category }
      );
    }

    if (productName) {
      queryBuilder = queryBuilder.andWhere('product.name ILIKE :productName', {
        productName: `%${productName}%`,
      });
    }

    if (rating && rating.length > 0) {
      queryBuilder = queryBuilder.andWhere(
        'product.averageRating IN (:...rating)',
        { rating }
      );
    }

    if (minPrice && maxPrice) {
      queryBuilder = queryBuilder.andWhere(
        'product.salesPrice BETWEEN :minPrice AND :maxPrice',
        {
          minPrice,
          maxPrice,
        }
      );
    }

    if (sort) {
      const sortDirection = sort.toString().toUpperCase() as 'ASC' | 'DESC';
      queryBuilder = queryBuilder.orderBy('product.createdAt', sortDirection);
    }

    const total = await queryBuilder.getCount();
    const products = await paginate(queryBuilder, page, limit).getMany();

    return res.status(200).json({
      data: products,
      total,
    });
  }
);
