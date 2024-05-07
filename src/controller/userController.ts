import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import dbConnection from '../database';
import { UserModel } from '../database/models/userModel';
import sendEmail from '../emails/index';
import jwt from 'jsonwebtoken';

// Assuming dbConnection.getRepository(UserModel) returns a repository instance
const userRepository = dbConnection.getRepository(UserModel);

interface CreateUserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'vendor' | 'buyer';
}

// Define validation and sanitization rules
const registerUserRules = [
  check('firstName').isLength({ min: 1 }).withMessage('First name is required'),
  check('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
  check('email').isEmail().normalizeEmail().withMessage('Email is not valid'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export const registerUser = [
  ...registerUserRules,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, password, userType } =
      req.body as CreateUserRequestBody;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      userType: userType,
    });

    const savedUser = await userRepository.save(newUser);

    // Generate token
    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: '1d' }
    );

    // Send confirmation email
    const confirmLink = `${process.env.APP_URL}/api/v1/confirm?token=${token}`;
    await sendEmail('confirm', email, { name: firstName, link: confirmLink });

    res.status(201).json({
      message: 'User successfully registered',
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        userType: savedUser.userType,
      },
    });
  },
];

export const confirmEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as {
      userId: number;
    };

    const user = await userRepository.findOne({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await userRepository.save(user);

    return res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Add this function to your userController.ts

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    // Delete all users
    const deletedUsers = await userRepository.delete({});
    // Return a success message with the number of deleted users
    return res.status(200).json({
      message: 'All users deleted successfully',
      count: deletedUsers.affected,
    });
  } catch (error) {
    // Return an error message if something goes wrong
    return res.status(500).json({ message: 'Failed to delete users' });
  }
};

// Add this function to your userController.ts

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Find all users
    const users = await userRepository.find();
    // Return the users
    return res.status(200).json(users);
  } catch (error) {
    // Return an error message if something goes wrong
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import dbConnection from '../database';
import { UserModel } from '../database/models/userModel';
import { Role } from '../database/models/roleEntity';

// Assuming dbConnection.getRepository(UserModel) returns a repository instance
const userRepository = dbConnection.getRepository(UserModel);
const roleRepository = dbConnection.getRepository(Role);

interface CreateUserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'vendor' | 'buyer';
}

// Define validation and sanitization rules
const registerUserRules = [
  check('firstName').isLength({ min: 1 }).withMessage('First name is required'),
  check('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
  check('email').isEmail().withMessage('Email is not valid'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export const registerUser = [
  // Apply validation and sanitization rules
  ...registerUserRules,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, password, userType } =
      req.body as CreateUserRequestBody;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole =
      userType == 'vendor'
        ? (await roleRepository.findOneBy({ name: 'Vendor' }))!
        : (await roleRepository.findOneBy({ name: 'Buyer' }))!;

    const newUser = new UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      userType: userRole,
    });

    const savedUser = await userRepository.save(newUser);
    res.status(201).json({
      message: 'User successfully registered',
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        userType: savedUser.userType,
      },
    });
  },
];

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'userType'],
      relations: ['userType'],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const deletedCount = await userRepository.delete({});
    res.status(200).json({ message: `Deleted ${deletedCount} users` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
