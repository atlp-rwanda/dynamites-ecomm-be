import { analyzeMessage, generateResponse } from '../utilis/nlp';
import Chat from '../database/models/chatbotModel';
import User from '../database/models/userModel';
import dbConnection from '../database';
import {
  getProducts,
  getProductByName,
  getOrderStatusByTrackingNumber,
  getServices,
  getServiceByName,
  getChatHistory,
  getProductDetails,
  getProductReviews,
} from '../service/chatbotService';
import { processMessage } from '../service/chatbotService';
jest.mock('../database');
jest.mock('../utilis/nlp');

describe('Chatbot Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processMessage', () => {
    const userId = 1;
    const user = { id: userId, firstName: 'John', lastName: 'Doe' } as User;

    const mockDate = (hour: number) => {
      const RealDate = Date;
      const mockDate = new RealDate();
      jest.spyOn(global, 'Date').mockImplementation(() => {
        mockDate.setHours(hour);
        return mockDate;
      });
    };

    const setupMocks = () => {
      const userRepoMock = {
        findOne: jest.fn().mockResolvedValue(user),
      };
      const chatRepoMock = {
        save: jest.fn().mockImplementation(async (chat: Chat) => chat),
      };
      (dbConnection.getRepository as jest.Mock).mockImplementation((entity) => {
        if (entity === User) return userRepoMock;
        if (entity === Chat) return chatRepoMock;
      });
      (analyzeMessage as jest.Mock).mockReturnValue('analyzed message');
      (generateResponse as jest.Mock).mockResolvedValue('response');
    };

    it('should return a complete response with a morning greeting', async () => {
      mockDate(9);
      setupMocks();

      const expectedGreeting = 'response';
      const result = await processMessage(userId, 'test message');

      expect(result.trim()).toEqual(expectedGreeting.trim());
    });

    it('should return a complete response with an afternoon greeting', async () => {
      mockDate(15);
      setupMocks();

      const expectedGreeting = 'response';
      const result = await processMessage(userId, 'test message');

      expect(result.trim()).toEqual(expectedGreeting.trim());
    });

    it('should return a complete response with an evening greeting', async () => {
      mockDate(20);
      setupMocks();

      const expectedGreeting = 'response';
      const result = await processMessage(userId, 'test message');

      expect(result.trim()).toEqual(expectedGreeting.trim());
    });

    it('should throw an error if user is not found', async () => {
      const userRepoMock = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      (dbConnection.getRepository as jest.Mock).mockReturnValue(userRepoMock);

      await expect(processMessage(userId, 'test message')).rejects.toThrow(
        'User not found'
      );

      expect(userRepoMock.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  it('should return a list of products', async () => {
    const productRepo = {
      find: jest.fn().mockResolvedValue([{ name: 'Product1' }]),
    };
    dbConnection.getRepository = jest.fn().mockReturnValue(productRepo);

    const products = await getProducts();
    expect(products).toEqual([{ name: 'Product1' }]);
  });

  describe('getProductByName', () => {
    it('should return a product by name', async () => {
      const productRepo = {
        findOne: jest.fn().mockResolvedValue({ name: 'Product1' }),
      };
      dbConnection.getRepository = jest.fn().mockReturnValue(productRepo);

      const product = await getProductByName('Product1');
      expect(product).toEqual({ name: 'Product1' });
    });
  });

  describe('getOrderStatusByTrackingNumber', () => {
    it('should return the status of an order by tracking number', async () => {
      const orderRepo = {
        findOne: jest.fn().mockResolvedValue({ status: 'Shipped' }),
      };
      dbConnection.getRepository = jest.fn().mockReturnValue(orderRepo);

      const status = await getOrderStatusByTrackingNumber('12345');
      expect(status).toBe('Shipped');
    });

    it('should return "Tracking number not found" if order is not found', async () => {
      const orderRepo = { findOne: jest.fn().mockResolvedValue(null) };
      dbConnection.getRepository = jest.fn().mockReturnValue(orderRepo);

      const status = await getOrderStatusByTrackingNumber('12345');
      expect(status).toBe('Tracking number not found');
    });
  });

  describe('getServices', () => {
    it('should return a list of services', async () => {
      const serviceRepo = {
        find: jest.fn().mockResolvedValue([{ name: 'Service1' }]),
      };
      dbConnection.getRepository = jest.fn().mockReturnValue(serviceRepo);

      const services = await getServices();
      expect(services).toEqual([{ name: 'Service1' }]);
    });
  });

  describe('getServiceByName', () => {
    it('should return a service by name', async () => {
      const serviceRepo = {
        findOne: jest.fn().mockResolvedValue({ name: 'Service1' }),
      };
      dbConnection.getRepository = jest.fn().mockReturnValue(serviceRepo);

      const service = await getServiceByName('Service1');
      expect(service).toEqual({ name: 'Service1' });
    });
  });

  describe('getChatHistory', () => {
    it('should return chat history for a user', async () => {
      const userId = 1;
      const chatRepo = {
        find: jest
          .fn()
          .mockResolvedValue([{ message: 'Hello', createdAt: '2024-05-31' }]),
      };
      dbConnection.getRepository = jest.fn().mockReturnValue(chatRepo);

      const chatHistory = await getChatHistory(userId);
      expect(chatHistory).toEqual([
        { message: 'Hello', createdAt: '2024-05-31' },
      ]);
    });
  });

  describe('getProductDetails', () => {
    it('should return product details by name', async () => {
      const productRepo = {
        findOne: jest
          .fn()
          .mockResolvedValue({ name: 'Product1', details: 'Product details' }),
      };
      dbConnection.getRepository = jest.fn().mockReturnValue(productRepo);

      const productDetails = await getProductDetails('Product1');
      expect(productDetails).toEqual({
        name: 'Product1',
        details: 'Product details',
      });
    });
  });

  describe('getProductReviews', () => {
    it('should return reviews for a product', async () => {
      const productRepo = {
        findOne: jest.fn().mockResolvedValue({
          name: 'Product1',
          reviews: [{ rating: 5, comment: 'Excellent' }],
        }),
      };
      dbConnection.getRepository = jest.fn().mockReturnValue(productRepo);

      const reviews = await getProductReviews('Product1');
      expect(reviews).toEqual([{ rating: 5, comment: 'Excellent' }]);
    });

    it('should return null if product is not found', async () => {
      const productRepo = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      dbConnection.getRepository = jest.fn().mockReturnValue(productRepo);

      const reviews = await getProductReviews('Product1');
      expect(reviews).toBeNull();
    });
  });
});


