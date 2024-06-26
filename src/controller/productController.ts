import { Request, Response } from 'express';
import Product from '../database/models/productEntity';
import Category from '../database/models/categoryEntity';
import UserModel from '../database/models/userModel';
import dbConnection from '../database';
import { check, validationResult } from 'express-validator';
import errorHandler from '../middlewares/errorHandler';
import productQuantityWatch from '../middlewares/productAvailabilityWatch';

import {eventEmitter} from '../Notification.vendor/event.services'

const userRepository = dbConnection.getRepository(UserModel);
const productRepository = dbConnection.getRepository(Product);

type User = {
  id: number;
  [key: string]: unknown;
};

const categoryRepository = dbConnection.getRepository(Category);

interface ProductRequestBody {
  name: string;
  image: string;
  gallery: string[];
  shortDesc: string;
  longDesc: string;
  categoryId: number;
  quantity: number;
  regularPrice: number;
  salesPrice: number;
  tags: string[];
  type: 'Simple' | 'Grouped' | 'Variable';
  isAvailable: boolean;
}

const createProductRules = [
  check('name').isLength({ min: 1 }).withMessage('Product name is required'),
  check('image').isLength({ min: 1 }).withMessage('Product image is required'),
  check('gallery').isArray().withMessage('Gallery must be an array'),
  check('shortDesc')
    .isLength({ min: 1 })
    .withMessage('Short description is required'),
  check('longDesc')
    .isLength({ min: 1 })
    .withMessage('Long description is required'),
  check('categoryId')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),
  check('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  check('regularPrice')
    .isFloat({ min: 0 })
    .withMessage('Regular price must be a non-negative number'),
  check('salesPrice')
    .isFloat({ min: 0 })
    .withMessage('Sales price must be a non-negative number'),
  check('tags').isArray().withMessage('Tags must be an array'),
  check('type')
    .isIn(['Simple', 'Grouped', 'Variable'])
    .withMessage('Invalid product type'),
];

export const createProduct = [
  ...createProductRules,
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user!.id;

    const {
      name,
      image,
      gallery,
      shortDesc,
      longDesc,
      categoryId,
      quantity,
      regularPrice,
      salesPrice,
      tags,
      type,
    } = req.body as ProductRequestBody;

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const vendor = await userRepository.findOne({
      where: { id: vendorId },
      select: {
        id: true,
        firstName: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const existingProduct = await productRepository.findOne({
      where: { name },
    });

    if (existingProduct) {
      return res.status(409).json({ message: 'Product name already exists' });
    }

    const newProduct = new Product({
      name,
      image,
      gallery,
      shortDesc,
      longDesc,
      category,
      vendor,
      quantity,
      regularPrice,
      salesPrice,
      tags,
      type,
    });
    const updatedProduct = await productRepository.save(newProduct);

    eventEmitter.emit('productCreated', updatedProduct)

    return res.status(201).json({
      message: 'Product successfully created',
      data: updatedProduct,
    });
  }),
];

const updateProductRules = [
  check('name').isLength({ min: 1 }).withMessage('Product name is required'),
  check('image').isLength({ min: 1 }).withMessage('Product image is required'),
  check('gallery').isArray().withMessage('Gallery must be an array'),
  check('shortDesc')
    .isLength({ min: 1 })
    .withMessage('Short description is required'),
  check('longDesc')
    .isLength({ min: 1 })
    .withMessage('Long description is required'),
  check('categoryId')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),
  check('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  check('regularPrice')
    .isFloat({ min: 0 })
    .withMessage('Regular price must be a non-negative number'),
  check('salesPrice')
    .isFloat({ min: 0 })
    .withMessage('Sales price must be a non-negative number'),
  check('tags').isArray().withMessage('Tags must be an array'),
  check('type')
    .isIn(['Simple', 'Grouped', 'Variable'])
    .withMessage('Invalid product type'),
  check('isAvailable')
    .isBoolean()
    .withMessage('isAvailable must be a boolean value'),
];
export const updateProduct = [
  ...updateProductRules,
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productId: number = parseInt(req.params.productId);
    const {
      name,
      image,
      gallery,
      shortDesc,
      longDesc,
      categoryId,
      quantity,
      regularPrice,
      salesPrice,
      tags,
      type,
      isAvailable,
    } = req.body as ProductRequestBody;

    const product = await productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    product.name = name;
    product.image = image;
    product.gallery = gallery;
    product.shortDesc = shortDesc;
    product.longDesc = longDesc;
    product.category = category;
    product.quantity = quantity;
    product.regularPrice = regularPrice;
    product.salesPrice = salesPrice;
    product.tags = tags;
    product.type = type;
    product.isAvailable = isAvailable;

    const updatedProduct = await productRepository.save(product);
    
    eventEmitter.emit('product_updated', updatedProduct)

    await productQuantityWatch(updatedProduct);
    return res.status(200).json({
      message: 'Product successfully updated',
      data: updatedProduct,
    });
  }),
];

export const getAllProducts = errorHandler(
  async (req: Request, res: Response) => {
    const products = await productRepository.find({
      select: {
        category: {
          name: true,
        },
        vendor: {
          firstName: true,
        },
      },
      relations: ['category', 'vendor'],
    });
    return res
      .status(200)
      .json({ message: 'Data retrieved successfully', data: products });
  }
);

export const getProduct = errorHandler(async (req: Request, res: Response) => {
  const productId: number = parseInt(req.params.productId);

  const product = await productRepository.findOne({
    where: { id: productId },
    select: {
      category: {
        name: true,
      },
      vendor: {
        firstName: true,
      },
      reviews:{
        content:true,
        rating:true,
        user:{
          firstName:true
        }
      },
    },
    relations: ['category', 'vendor','reviews'],
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res
    .status(200)
    .json({ message: 'Data retrieved successfully', data: product });
});

export const deleteProduct = errorHandler(
  async (req: Request, res: Response) => {
    const productId: number = parseInt(req.params.productId);

    const product = await productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' });
    }

    eventEmitter.emit('product_deleted', productId)
    
    await productRepository.delete(productId);
    
    return res.status(200).json({ message: 'Product deleted successfully' });
  }
);

export const deleteAllProduct = errorHandler(
  async (req: Request, res: Response) => {
    const deletedProducts = await productRepository.delete({});
    return res.status(200).json({
      message: 'All product deleted successfully',
      count: deletedProducts.affected,
    });
  }
);

export const getRecommendedProducts = errorHandler(
  async (req: Request, res: Response) => {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();

    const holidayTags: { [key: string]: string[] } = {
      '0': ['New Year', 'Winter'],
      '1': ['Winter'],
      '2': day >= 14 ? ['Valentines', 'Spring'] : ['Spring'],
      '3': ['Spring'],
      '4': ['Spring', 'Summer'],
      '5': ['Summer'],
      '6': ['Summer'],
      '7': ['Summer', 'Autumn'],
      '8': ['Autumn'],
      '9': ['Autumn'],
      '10': ['Autumn', 'Winter'],
      '11': ['Winter', 'Christmas'],
    };

    const recommendedTags = holidayTags[month.toString()] || [];
    const allProducts = await productRepository.find();
    const recommendedProducts = allProducts.filter(
      (product) =>
        product.isAvailable &&
        product.tags.some((tag) =>
          recommendedTags
            .map((tag) => tag.toLowerCase())
            .includes(tag.toLowerCase())
        )
    );

    return res.status(200).json({
      message: 'Recommended products retrieved successfully',
      data: recommendedProducts,
    });
  }
);

export const AvailableProducts = errorHandler(
  async (req: Request, res: Response) => {
    let limit: number;
    let page: number;

    if (req.query.limit == undefined && req.query.page == undefined) {
      limit = 10;
      page = 1;
    } else {
      limit = parseInt(req.query.limit as string);
      page = parseInt(req.query.page as string);
    }
    const [availableProducts, totalCount] =
      await productRepository.findAndCount({
        where: { isAvailable: true },
        take: limit,
        skip: (page - 1) * limit,
        select: { vendor: { firstName: true, lastName: true, picture: true, id:true, email:true} },
        relations: ['category', 'vendor'],
      });

    return res.status(200).json({
      status: 'success',
      message: 'Items retrieved successfully.',
      availableProducts,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  }
);

// From Bernard #38

export const updateProductAvailability = async (
  req: Request,
  res: Response
) => {
  const { productId } = req.params;
  const { availability } = req.body;
  const user = await userRepository.findOne({
    where: { id: (req.user as User).id },
  });

  if (!user) {
    return res.status(401);
  }

  const product = await productRepository.findOne({
    where: { id: Number(productId) },
    relations: ['vendor'],
  });

  if (!product) {
    return res.status(404).json({ msg: 'Product not found' });
  }

  if (product.vendor.id !== user.id) {
    return res.status(403).json({ msg: 'Product not owned by vendor' });
  }

  product.isAvailable = availability;
  await productRepository.save(product);

  res.json({ msg: 'Product availability updated' });
};

export const checkProductAvailability = async (req: Request, res: Response) => {
  const { productId } = req.params;

  const product = await productRepository.findOne({
    where: { id: Number(productId) },
    relations: ['vendor'],
  });

  const user = await userRepository.findOne({
    where: { id: (req.user as User).id },
  });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  if (!product) {
    return res.status(404).json({ msg: 'Product not found' });
  }
  if (product.vendor.id !== user.id) {
    return res.status(403).json({ msg: 'Product not owned by vendor' });
  }

  const availability = product.isAvailable;

  res.json({ availability, productId });
};
