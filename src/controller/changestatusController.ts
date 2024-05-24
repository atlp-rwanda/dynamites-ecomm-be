import { Request, Response } from 'express';
import UserModel from '../database/models/userModel';
import dbConnection from '../database';
import { check, validationResult } from 'express-validator';
import errorHandler from '../middlewares/errorHandler';
const userRepository = dbConnection.getRepository(UserModel);

export const activateAccount = [
  check('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.userId);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'active') {
      return res
        .status(400)
        .json({ message: 'User account is already active' });
    }

    user.status = 'active';
    await userRepository.save(user);

    return res
      .status(200)
      .json({ message: 'User account activated successfully' });
  }),
];

export const deactivateAccount = [
  check('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  errorHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.userId);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'inactive') {
      return res
        .status(400)
        .json({ message: 'User account is already inactive' });
    }

    user.status = 'inactive';
    await userRepository.save(user);

    return res
      .status(200)
      .json({ message: 'User account deactivated successfully' });
  }),
];
