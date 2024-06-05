import {
  analyzeMessage,
  generateResponse,
  identifyIntent,
  extractKeyword,
} from '../utilis/nlp';

import { getProducts } from '../service/chatbotService';

// Mock the services used in generateResponse
jest.mock('../service/chatbotService', () => ({
  getProductByName: jest.fn(),
  getProducts: jest.fn(),
  getOrderByUserId: jest.fn(),
  getOrderStatusByTrackingNumber: jest.fn(),
  getServices: jest.fn(),
  getServiceByName: jest.fn(),
}));

describe('npl.ts tests', () => {
  describe('extractKeyword', () => {
    it('should extract keyword correctly', () => {
      expect(
        extractKeyword('tell me more about product', 'tell me more about')
      ).toBe('product');
    });
  });

  describe('analyzeMessage', () => {
    it('should convert message to lowercase', () => {
      expect(analyzeMessage('Hello World')).toBe('hello world');
    });
  });

  describe('identifyIntent', () => {
    it('should identify greeting intent', () => {
      expect(identifyIntent('hello')).toEqual({
        intent: 'greeting',
        keyword: '',
      });
    });

    it('should identify listProducts intent', () => {
      expect(identifyIntent('what products do you sell')).toEqual({
        intent: 'listProducts',
        keyword: '',
      });
    });

    it('should return unknown intent for unrecognized message', () => {
      expect(identifyIntent('random message')).toEqual({
        intent: 'unknown',
        keyword: '',
      });
    });
  });

  describe('generateResponse', () => {
    const userId = 1;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return greeting message', async () => {
      const response = await generateResponse('hello', userId);
      expect(response).toBe('How can I assist you today?');
    });

    it('should list products', async () => {
      const products = [{ name: 'Product1' }, { name: 'Product2' }];
      (getProducts as jest.Mock).mockResolvedValue(products);

      const response = await generateResponse(
        'what products do you sell',
        userId
      );
      expect(response).toBe(
        'We sell the following products: Product1, Product2.'
      );
    });
  });
});
