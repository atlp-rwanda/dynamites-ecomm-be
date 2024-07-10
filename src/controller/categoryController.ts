import { Request, Response } from 'express';
import dbConnection from '../database';
import Category from '../database/models/categoryEntity';
import { check, validationResult } from 'express-validator';
import errorHandler from '../middlewares/errorHandler';
import { Order } from '../database/models/orderEntity';

const categoryRepository = dbConnection.getRepository(Category);
const orderRepository = dbConnection.getRepository(Order)

interface categoryRequestBody {
  name: string;
  description: string;
  icon: string;
}

const createCategoryRules = [
  check('name').isLength({ min: 1 }).withMessage('Category name is required'),
  check('icon').isLength({ min: 1 }).withMessage('Category icon is required'),
  check('description')
    .isLength({ min: 1 })
    .withMessage('Category description is required'),
];

export const createCategory = [
  ...createCategoryRules,
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description, icon } = req.body as categoryRequestBody;

    const existingCategory = await categoryRepository.findOne({
      where: { name },
    });
    if (existingCategory) {
      return res.status(409).json({ message: 'Category name already exists' });
    }
    const newCategory = new Category({
      name: name,
      description: description,
      icon: icon,
    });
    const updatedCategory = await categoryRepository.save(newCategory);
    return res.status(201).json({
      message: 'Category successfully created',
      data: updatedCategory,
    });
  }),
];

export const getAllCategories = errorHandler(
  async (req: Request, res: Response) => {
    const categories = await categoryRepository.find();
    return res
      .status(200)
      .json({ message: 'Data retrieved successfully', data: categories });
  }
);

export const getCategory = errorHandler(async (req: Request, res: Response) => {
  const categoryId: number = parseInt(req.params.categoryId);

  const category = await categoryRepository.findOne({
    where: { id: categoryId },
  });

  if (!category) {
    return res.status(404).json({ message: 'Category Not Found' });
  }

  res
    .status(200)
    .json({ message: 'Data retrieved successfully', data: category });
});

export const updateCategory = [
  ...createCategoryRules,
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoryId: number = parseInt(req.params.categoryId);
    const { name, description, icon } = req.body as categoryRequestBody;

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category Not Found' });
    }

    const existingCategory = await categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory && existingCategory.id !== categoryId) {
      return res.status(409).json({ message: 'Category name already exists' });
    }

    category.name = name;
    category.description = description;
    category.icon = icon;

    const updatedCategory = await categoryRepository.save(category);

    return res.status(200).json({
      message: 'Category successfully updated',
      data: updatedCategory,
    });
  }),
];

export const deleteCategory = errorHandler(
  async (req: Request, res: Response) => {
    const categoryId: number = parseInt(req.params.categoryId);

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category Not Found' });
    }

    await categoryRepository.delete(categoryId);

    res.status(200).json({ message: 'Category deleted successfully' });
  }
);

export const getCategoryMetrics = errorHandler(
  async (req: Request, res: Response) => {
    const orders = await orderRepository.find({
      where:{
        paid: true
      },
      select:{
        id:true,
        totalAmount:true,
        paid:true,
        orderDetails:{
          id:true,
          price:true,
          quantity:true,
          product:{
            id:true,
            name:true,
            category:{
              id:true,
              name:true
            }
          },
        }
      },
      relations:['orderDetails','orderDetails.product','orderDetails.product.category']
    })

    const categories = await categoryRepository.find({
      select:{
        products:{
          id:true
        }
      },
      relations: ['products']
    })

    const counter:{[key:string]:number} = {};
    for(const order of orders){
      for(const orderDetail of order.orderDetails){
        if(orderDetail.product.category.name in order){
          counter[orderDetail.product.category.name] += orderDetail.price
        }else{
          counter[orderDetail.product.category.name] = orderDetail.price
        }
      }
    }

    const data = []

    for(const category of categories){
      if(category.name in counter){
        data.push({
          categoryName: category.name,
          totalProducts: category.products.length,
          totalSales: counter[category.name]
        })
      }
    }

    data.sort((a, b) => b.totalSales - a.totalSales)

    return res.status(200).json({data:data.slice(0,4)})
  }
);