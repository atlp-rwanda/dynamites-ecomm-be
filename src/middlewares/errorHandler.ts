import { Request, Response, NextFunction } from 'express';

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

function errorHandler(func: MiddlewareFunction) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await func(req, res, next);
      } catch (error) { // Removed the type annotation from the catch clause variable because it caused liting errors
        const message = error.detail || 'Internal Server Error';
        res.status(500).send(message);
      }
    };
  }

export default errorHandler;
