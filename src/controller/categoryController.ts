import { Request, Response } from 'express';
import dbConnection from '../database';
import Category from '../database/models/categoryEntity';
import { check, validationResult } from 'express-validator';
import errorHandler from '../middlewares/errorHandler';

const categoryRepository = dbConnection.getRepository(Category);

interface categoryRequestBody {
  name: string;
  description: string;
}

const createCategoryRules = [
  check('name').isLength({ min: 1 }).withMessage('Category name is required'),
  check('description')
    .isLength({ min: 1 })
    .withMessage('Category description is required'),
];

export const createCategory = [
  ...createCategoryRules,
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { name, description } = req.body as categoryRequestBody;

    const existingCategory = await categoryRepository.findOne({
      where: { name },
    });
    if (existingCategory) {
      res.status(409).json({ message: 'Category name already exists' });
      return;
    }
    const newCategory = new Category({
      name: name,
      description: description,
    });
    const updatedCategory = await categoryRepository.save(newCategory);
    res.status(201).json({
      message: 'Category successfully created',
      data: updatedCategory,
    });
  }),
];

export const getAllCategories = errorHandler(
  async (req: Request, res: Response) => {
    const categories = await categoryRepository.find();
    res
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
    res.status(404).json({ message: 'Category Not Found' });
    return;
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
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const categoryId: number = parseInt(req.params.categoryId);
    const { name, description } = req.body as categoryRequestBody;

    const category = await categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(404).json({ message: 'Category Not Found' });
      return;
    }

    const existingCategory = await categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory && existingCategory.id !== categoryId) {
      res.status(409).json({ message: 'Category name already exists' });
      return;
    }

    category.name = name;
    category.description = description;

    const updatedCategory = await categoryRepository.save(category);

    res.status(200).json({
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
      res.status(404).json({ message: 'Category Not Found' });
      return;
    }

    await categoryRepository.delete(categoryId);

    res.status(200).json({ message: 'Category deleted successfully' });
  }
);
