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
