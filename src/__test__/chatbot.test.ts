import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook, getBuyerToken } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);
let buyerToken: string;

describe('Chatbot Interactions', () => {
  beforeAll(async () => {
    buyerToken = await getBuyerToken();
  });

  describe('Ask Question Endpoint', () => {
    it('should respond to a valid question with the correct answer for logged-in users', async () => {
      const chatData = {
        message: 'What do you sell?',
      };

      const response = await request(app)
        .post('/api/v1/chat')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(chatData);

      expect(response.statusCode).toEqual(200);
      expect(response.body.message).toContain(
        'We sell the following products:'
      );
    });
  });

  describe('Fetch All Chat History', () => {
    it('should return the full chat history for the authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/chat/history')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.statusCode).toEqual(200);
      expect(Array.isArray(response.body.history)).toBeTruthy();
    });
  });
});
