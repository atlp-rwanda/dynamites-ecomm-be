import { Router } from 'express';
import {
  getChatResponse,
  getChatHistory,
} from '../controller/chatbotController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';

const router = Router();

router.post('/chat', getChatResponse);
router.get('/chat/history', IsLoggedIn, checkRole(['Buyer']), getChatHistory);

export default router;
