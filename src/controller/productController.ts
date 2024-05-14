import { Request, Response } from 'express';
import Product from '../database/models/productEntity';
import Category from '../database/models/categoryEntity';
import UserModel from '../database/models/userModel';
import dbConnection from '../database';
import { check, validationResult } from 'express-validator';

const productRepository = dbConnection.getRepository(Product);
const categoryRepository = dbConnection.getRepository(Category);
const userRepository = dbConnection.getRepository(UserModel);

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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const vendorId = req.user!.userId;

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

    try {
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
      return res.status(201).json({
        message: 'Product successfully created',
        data: updatedProduct,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to create product' });
    }
  },
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
  async (req: Request, res: Response) => {
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

    try {
      const product = await productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (categoryId <= 0) {
        return res.status(400).json({ message: 'Invalid category ID' });
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

      return res.status(200).json({
        message: 'Product successfully updated',
        data: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const getAllProducts = async (req: Request, res: Response) => {
  try {
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
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
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
      },
      relations: ['category', 'vendor'],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res
      .status(200)
      .json({ message: 'Data retrieved successfully', data: product });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId: number = parseInt(req.params.productId);

    const product = await productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' });
    }

    await productRepository.delete(productId);

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteAllProduct = async (req: Request, res: Response) => {
  try {
    const deletedProducts = await productRepository.delete({});
    return res.status(200).json({
      message: 'All product deleted successfully',
      count: deletedProducts.affected,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product' });
  }
};
