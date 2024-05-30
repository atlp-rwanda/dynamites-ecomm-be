import { Request, Response } from 'express';

type MiddlewareFunction = (
  req: Request,
  res: Response
) => Promise<Response<Record<string, unknown>> | undefined>;

function errorHandler(func: MiddlewareFunction): MiddlewareFunction {
  return async (req: Request, res: Response) => {
    try {
      return await func(req, res);
    } catch (error) {
      /* istanbul ignore start */
      const message =
        (error as { detail?: string }).detail || 'Internal Server Error';
      return res.status(500).send(message);
      /* istanbul ignore end */
    }
  };
}

export default errorHandler;
