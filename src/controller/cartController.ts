import { Cart } from '../database/models/cartEntity';
import { Request, Response } from 'express';
import dbConnection from '../database';
import errorHandler from '../middlewares/errorHandler';
import Product from '../database/models/productEntity';
import UserModel from '../database/models/userModel';

const cartRepository = dbConnection.getRepository(Cart);
const productRepository = dbConnection.getRepository(Product);
const userRepository = dbConnection.getRepository(UserModel);

export const addToCart = errorHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user!.id;

  const product = await productRepository.findOne({
    where: {
      id: productId,
    },
  });

  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!product || !user) {
    return res.status(404).json({ msg: 'Product or User not found' });
  }

  if (quantity <= 0) {
    return res.status(409).json({ msg: 'Invalid Quantity' });
  }

  if (quantity > product.quantity) {
    return res.status(409).json({ msg: 'Quantity exceeds available quantity' });
  }

  const newItem = new Cart();
  newItem.user = user;
  newItem.product = product;
  newItem.quantity = quantity;

  const savedItem = await cartRepository.save(newItem);

  return res
    .status(201)
    .json({ msg: 'Item added to cart successfully', cartItem: savedItem });
});

export const getCartItems = errorHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const cartItems = await cartRepository.find({
      where: {
        user: user!,
      },
      select: {
        user: {
          id: true,
        },
        product: {
          id: true,
          name: true,
          image: true,
          quantity: true,
          salesPrice: true,
          regularPrice: true,
        },
      },
      relations: ['user', 'product'],
    });

    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += item.product.salesPrice * item.quantity;
    }
    return res.status(200).json({ cartItems, totalAmount });
  }
);

export const updateQuantity = errorHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.itemId);
    const { quantity } = req.body;

    const cartItem = await cartRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user', 'product'],
    });

    if (!cartItem) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    if (quantity <= 0) {
      return res.status(409).json({ msg: 'Invalid Quantity' });
    }

    if (quantity > cartItem.product.quantity) {
      return res
        .status(409)
        .json({ msg: 'Quantity exceeds available quantity' });
    }

    cartItem.quantity = quantity;

    await cartRepository.save(cartItem);

    return res.status(200).json({ msg: 'Quantity successfully updated' });
  }
);

export const removeItem = errorHandler(async (req: Request, res: Response) => {
  const itemId: number = parseInt(req.params.itemId);

  const cartItem = await cartRepository.findOne({
    where: { id: itemId },
  });

  if (!cartItem) {
    return res.status(404).json({ msg: 'Item not found' });
  }
  const deletedItem = await cartRepository.delete(itemId);

  return res.status(200).json({
    msg: 'Cart Item deleted successfully',
    count: deletedItem.affected,
  });
});

export const removeAllItems = errorHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const deletedItems = await cartRepository.delete({ user: user! });

    return res.status(200).json({
      msg: 'Cart Items deleted successfully',
      count: deletedItems.affected,
    });
  }
);
