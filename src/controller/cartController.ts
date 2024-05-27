import { Cart } from '../database/models/cartEntity';
import { Request, Response } from 'express';
import dbConnection from '../database';
import errorHandler from '../middlewares/errorHandler';
import Product from '../database/models/productEntity';
import UserModel from '../database/models/userModel';
// import applyCoupon from '../utilis/couponCalculator';
import { Order } from '../database/models/orderEntity';
import { OrderDetails } from '../database/models/orderDetailsEntity';
import Coupon from '../database/models/couponEntity';

const cartRepository = dbConnection.getRepository(Cart);
const productRepository = dbConnection.getRepository(Product);
const userRepository = dbConnection.getRepository(UserModel);
const orderRepository = dbConnection.getRepository(Order);
const couponRepository = dbConnection.getRepository(Coupon);

export const addToCart = errorHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user!.id;

  const product = await productRepository.findOne({
    where: { id: productId },
  });

  const user = await userRepository.findOne({
    where: { id: userId },
    select: { id: true },
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

export const getCartItems = errorHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const user = await userRepository.findOne({
    where: { id: userId },
  });

  const cartItems = await cartRepository.find({
    where: { user: user! },
    select: {
      user: { id: true },
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
});

export const updateQuantity = errorHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.itemId);
  const { quantity } = req.body;

  const cartItem = await cartRepository.findOne({
    where: { id: id },
    relations: ['user', 'product'],
  });

  if (!cartItem) {
    return res.status(404).json({ msg: 'Item not found' });
  }

  if (quantity <= 0) {
    return res.status(409).json({ msg: 'Invalid Quantity' });
  }

  if (quantity > cartItem.product.quantity) {
    return res.status(409).json({ msg: 'Quantity exceeds available quantity' });
  }

  cartItem.quantity = quantity;

  await cartRepository.save(cartItem);

  return res.status(200).json({ msg: 'Quantity successfully updated' });
});

export const removeItem = errorHandler(async (req: Request, res: Response) => {
  const itemId: number = parseInt(req.params.itemId);

  const cartItem = await cartRepository.findOne({ where: { id: itemId } });

  if (!cartItem) {
    return res.status(404).json({ msg: 'Item not found' });
  }
  const deletedItem = await cartRepository.delete(itemId);

  return res.status(200).json({
    msg: 'Cart Item deleted successfully',
    count: deletedItem.affected,
  });
});

export const removeAllItems = errorHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await userRepository.findOne({ where: { id: userId } });

  const deletedItems = await cartRepository.delete({ user: user! });

  return res.status(200).json({
    msg: 'Cart Items deleted successfully',
    count: deletedItems.affected,
  });
});

export const checkout = errorHandler(async (req: Request, res: Response) => {
  const { deliveryInfo, paymentInfo, couponCode } = req.body;
  const userId = req.user?.id;

  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const cartItems = await cartRepository.find({
    where: { user: { id: userId } },
    relations: ['product'],
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ msg: 'Cart is empty' });
  }

  let totalAmount = 0;
  const orderDetails: OrderDetails[] = [];

  for (const item of cartItems) {
    const product = item.product;

    let price = product.salesPrice * item.quantity;

    // Apply any applicable coupon for each product
    if (couponCode) {
      const coupon = await couponRepository.findOne({
        where: { code: couponCode },
        relations: ['applicableProducts'],
      });

      if (coupon) {
        const applicableProduct = coupon.applicableProducts.find(
          (applicableProduct) => applicableProduct.id === product.id
        );

        if (applicableProduct) {
          price = price * (1 - coupon.percentage / 100);
        }
      }
    }

    totalAmount += price;

    const orderDetail = new OrderDetails();
    orderDetail.product = product;
    orderDetail.quantity = item.quantity;
    orderDetail.price = price;

    orderDetails.push(orderDetail);
  }

  const trackingNumber = `Tr${Math.random().toString().slice(2, 8)}`;

  const order = new Order();
  order.user = user;
  order.totalAmount = totalAmount;
  order.deliveryInfo = deliveryInfo;
  order.paymentInfo = paymentInfo;
  order.trackingNumber = trackingNumber;
  order.orderDetails = orderDetails;

  const savedOrder = await orderRepository.save(order);

  await cartRepository.delete({ user: { id: userId } });

  return res.status(201).json({
    msg: 'Order placed successfully',
    order: savedOrder,
    trackingNumber,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});

export const deleteAllOrders = errorHandler(async (req: Request, res: Response) => {
  const deletedOrders = await orderRepository.delete({});

  return res.status(200).json({
    msg: 'All orders deleted successfully',
    count: deletedOrders.affected,
  });
});

export const getAllOrders = errorHandler(async (req: Request, res: Response) => {
  const orders = await orderRepository.find({ relations: ['orderDetails'] });
  return res.status(200).json({ orders });
});

export const cancelOrder = errorHandler(async (req: Request, res: Response) => {
  const orderId: number = parseInt(req.params.orderId);

  const order = await orderRepository.findOne({
    where: { id: orderId },
    relations: ['orderDetails'],
  });

  if (!order) {
    return res.status(404).json({ msg: 'Order not found' });
  }

  for (const orderDetail of order.orderDetails) {
    if (orderDetail.product) {
      orderDetail.product.quantity += orderDetail.quantity;
      await dbConnection.getRepository('Product').save(orderDetail.product);
    }
  }

  await orderRepository.remove(order);

  return res.status(200).json({ msg: 'Order canceled successfully' });
});
