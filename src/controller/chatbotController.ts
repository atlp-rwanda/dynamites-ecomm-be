import { Request, Response } from 'express';
import * as chatbotService from '../service/chatbotService';
import errorHandler from '../middlewares/errorHandler';

export const getChatResponse = errorHandler(
  async (
    req: Request,
    res: Response
  ): Promise<Response<Record<string, unknown>> | undefined> => {
    const { message } = req.body;
    const userId = req.user?.id;
    const response = await chatbotService.processMessage(userId, message);
    return res.status(200).json({ message: response });
  }
);
export const getChatHistory = errorHandler(
  async (
    req: Request,
    res: Response
  ): Promise<Response<Record<string, unknown>> | undefined> => {
    const userId = req.user?.id;
    const history = await chatbotService.getChatHistory(userId);
    return res.status(200).json({ history });
  }
);
