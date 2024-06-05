import { analyzeMessage, generateResponse } from '../utilis/nlp';
import Chat from '../database/models/chatbotModel';
import User from '../database/models/userModel';
import dbConnection from '../database';
import Product from '../database/models/productEntity';
import { Order } from '../database/models/orderEntity';
import Service from '../database/models/serviceEntity';
import { Cart } from '../database/models/cartEntity';
import Category from '../database/models/categoryEntity';

const cartRepository = dbConnection.getRepository(Cart);
const categoryRepository = dbConnection.getRepository(Category);
export const processMessage = async (
  userId: number,
  message: string
): Promise<string> => {
  const userRepo = dbConnection.getRepository(User);
  const chatRepo = dbConnection.getRepository(Chat);

  const user = await userRepo.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  const analyzedMessage = analyzeMessage(message);

  const response = await generateResponse(analyzedMessage, userId);

  const chat = new Chat();
  chat.user = user;
  chat.message = message;
  chat.response = response;
  await chatRepo.save(chat);

  return response;
};

export const getChatHistory = async (userId: number): Promise<Chat[]> => {
  const chatRepo = dbConnection.getRepository(Chat);
  return chatRepo.find({
    where: { user: { id: userId } },
    order: { createdAt: 'DESC' },
  });
};

export const getProducts = async () => {
  const productRepo = dbConnection.getRepository(Product);
  return productRepo.find();
};

export const getOrderStatusByTrackingNumber = async (
  trackingNumber: string
) => {
  const orderRepo = dbConnection.getRepository(Order);
  const order = await orderRepo.findOne({ where: { trackingNumber } });
  return order ? order.status : 'Tracking number not found';
};

export const getServices = async () => {
  const serviceRepo = dbConnection.getRepository(Service);
  return serviceRepo.find();
};

export const getServiceByName = async (name: string) => {
  const serviceRepo = dbConnection.getRepository(Service);
  return serviceRepo.findOne({ where: { name } });
};

export const getProductByName = async (name: string) => {
  const productRepo = dbConnection.getRepository(Product);
  return productRepo.findOne({ where: { name } });
};

export const getProductDetails = async (productName: string) => {
  const productRepo = dbConnection.getRepository(Product);
  return productRepo.findOne({ where: { name: productName } });
};

export const getProductReviews = async (productName: string) => {
  const productRepo = dbConnection.getRepository(Product);
  const product = await productRepo.findOne({
    where: { name: productName },
    relations: ['reviews'],
  });
  return product ? product.reviews : null;
};

export const getCartItems = async (userId: number): Promise<Cart[]> => {
  return await cartRepository.find({
    where: { user: { id: userId } },
    relations: ['product'],
  });
};

export const getTotalCartAmount = async (userId: number): Promise<number> => {
  const cartItems = await getCartItems(userId);
  return cartItems.reduce(
    (total, item) => total + item.product.salesPrice * item.quantity,
    0
  );
};

export const getCartItemQuantity = async (userId: number): Promise<number> => {
  const cartItems = await getCartItems(userId);
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

export const getProductCategories = async (): Promise<Category[]> => {
  return await categoryRepository.find();
};
