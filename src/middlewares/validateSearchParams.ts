import { query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
export const validateSearchParams = [
  query('keyword').optional().isString().withMessage('Keyword must be a string'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('brand').optional().isString().withMessage('Brand must be a string'),
  query('productName').optional().isString().withMessage('Product name must be a string'),
  query('sort').optional().isIn(['asc', 'desc']).withMessage('Sort order must be either asc or desc'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];