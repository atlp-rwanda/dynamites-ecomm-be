import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import BuyerWishList  from '../database/models/buyerWishList';
import  UserModel from '../database/models/userModel';  
import  Product  from '../database/models/productEntity';  
import { getRepository } from 'typeorm';
import errorHandler from '../middlewares/errorHandler';  

const createBuyerRules = [
  check('userId').isLength({ min: 1 }).withMessage('User is required'),
  check('productId').isLength({ min: 1 }).withMessage('Product is required'),
];

export const CreateWishList = [
  ...createBuyerRules,
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, productId, time } = req.body;

    const userRepository = getRepository(UserModel);
    const productRepository = getRepository(Product);
    const buyerWishListRepository = getRepository(BuyerWishList);

    const user = await userRepository.findOne(userId);
    const product = await productRepository.findOne(productId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const wishList = new BuyerWishList();
    wishList.user = user;
    wishList.product = [product];
    wishList.time = time;

    const savedWishList = await buyerWishListRepository.save(wishList);

    return res.status(201).json({
      message: 'WishList successfully created',
      data: savedWishList,
    });
  }),
];

const removeProductRules = [
    check('userId').isLength({ min: 1 }).withMessage('User ID is required'),
    check('productId').isLength({ min: 1 }).withMessage('Product ID is required'),
  ];
  

export const RemoveProductFromWishList = [
    ...removeProductRules,
    errorHandler(async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { userId, productId } = req.body;
  
      const buyerWishListRepository = getRepository(BuyerWishList);
      const productRepository = getRepository(Product);
  
      // Find the user's wishlist
      const wishList = await buyerWishListRepository.findOne({
        where: { user: { id: userId } },
        relations: ['products'],
      });
  
      if (!wishList) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
  
      // Find the product to be removed
      const product = await productRepository.findOne(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Check if the product exists in the wishlist
      const productIndex = wishList.product.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in wishlist' });
      }
  
      // Remove the product from the wishlist
      wishList.product.splice(productIndex, 1);
  
      // Save the updated wishlist
      await buyerWishListRepository.save(wishList);
  
      return res.status(200).json({
        message: 'Product successfully removed from wishlist',
        data: wishList,
      });
    }),
  ];
  
