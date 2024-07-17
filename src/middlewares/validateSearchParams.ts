import { query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
export const validateSearchParams = [
  query('keyword')
    .optional()
    .isString()
    .withMessage('Keyword must be a string'),
  query('category')
    .optional()
    .isArray()
    .withMessage('Category must be an array'),
  query('rating').optional().isArray().withMessage('Rating must be an array'),
  query('page').optional().isString().withMessage('Page must be a number'),
  query('minPrice')
    .optional()
    .isString()
    .withMessage('minPrice must be a number'),
  query('maxPrice')
    .optional()
    .isString()
    .withMessage('maxPrice must be a number'),
  query('brand').optional().isString().withMessage('Brand must be a string'),
  query('productName')
    .optional()
    .isString()
    .withMessage('Product name must be a string'),
  query('sort')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
