import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const errorHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error('Error:', error);
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Check if the error is related to token verification failure
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
      statusCode = 404;
      message = 'Invalid or expired token';
    }

    // Handle other types of errors here if needed

    return res.status(statusCode).json({ message });
  }
};
