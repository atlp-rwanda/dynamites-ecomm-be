import { Request, Response, NextFunction } from 'express';


function errorHandler(func: Function) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await func(req, res, next);
      } catch (error: any) {
        console.log({ error });
        const message = error.detail || 'Internal Server Error';
        res.status(500).send(message);
      }
    };
  }

export default errorHandler;
