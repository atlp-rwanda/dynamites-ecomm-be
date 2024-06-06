import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import BuyerWishList from '../database/models/buyerWishList';
import UserModel from '../database/models/userModel';
import Product from '../database/models/productEntity';
import errorHandler from '../middlewares/errorHandler';
import dbConnection from '../database';

const userRepository = dbConnection.getRepository(UserModel);
const productRepository = dbConnection.getRepository(Product);
const buyerWishListRepository = dbConnection.getRepository(BuyerWishList);

const AddToWishListRules = [
  check('productId').isLength({ min: 1 }).withMessage('Product ID is required'),
];

export const AddItemInWishList = [
  ...AddToWishListRules,
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user!.id;
    const { productId, time } = req.body;
    const wishListTime = time ? new Date(time) : new Date();

    const user = await userRepository.findOne({ where: { id: userId } });
    const product = await productRepository.findOne({
      where: { id: productId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingWishListEntry = await buyerWishListRepository.findOne({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    if (existingWishListEntry) {
      const productExists = existingWishListEntry.product.some(
        (p) => p.id === productId
      );
      if (productExists) {
        return res
          .status(409)
          .json({ message: 'Product is already in the wishlist' });
      }
      existingWishListEntry.product.push(product);
      existingWishListEntry.time = wishListTime;
      const updatedWishList = await buyerWishListRepository.save(
        existingWishListEntry
      );
      return res.status(200).json({
        message: 'Product added to existing wishlist',
        data: updatedWishList,
      });
    }

    const newWishList = new BuyerWishList();
    newWishList.user = user;
    newWishList.product = [product];
    newWishList.time = wishListTime;

    const savedWishList = await buyerWishListRepository.save(newWishList);
    return res.status(201).json({
      message: 'Wishlist successfully created',
      data: savedWishList,
    });
  }),
];

const removeProductRules = [
  check('productId').isLength({ min: 1 }).withMessage('Product ID is required'),
];

export const RemoveProductFromWishList = [
  ...removeProductRules,
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user?.id;
    const { productId } = req.body;

    const wishList = await buyerWishListRepository.findOne({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    if (!wishList) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const productIndex = wishList.product.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    wishList.product.splice(productIndex, 1);
    await buyerWishListRepository.save(wishList);

    return res.status(200).json({
      message: 'Product successfully removed from wishlist',
      data: wishList,
    });
  }),
];

export const getAllWishList = errorHandler(
  async (req: Request, res: Response) => {
    const wishList = await buyerWishListRepository.find({
      select: {
        product: true,
        time: true,
        user: {
          lastName: true,
          isVerified: true,
          picture: true,
          userType: {
            name: true,
          },
        },
      },
      relations: ['user', 'product'],
    });
    return res
      .status(200)
      .json({ message: 'Data retrieved successfully', data: wishList });
  }
);

export const getOneWishList = errorHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(404).json({ message: 'Data Id Not Found' });
    }
    const wishList = await buyerWishListRepository.findOne({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    return res
      .status(200)
      .json({ message: 'Data retrieved successfully', data: wishList });
  }
);
