import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import dbConnection from '../database';
import { Role } from '../database/models/roleEntity';
import UserModel from '../database/models/userModel';
import sendEmail from '../emails/index';
import { sendCode } from '../emails/mailer';
import jwt from 'jsonwebtoken';
import errorHandler from '../middlewares/errorHandler';

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

    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: '1d' }
    );

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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find({
      // select: ['id', 'firstName', 'lastName', 'email', 'userType'],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userType: {
          id: true,
          name: true,
        },
      },
      relations: ['userType'],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const deletedUsers = await userRepository.delete({});
    return res.status(200).json({
      message: 'All users deleted successfully',
      count: deletedUsers.affected,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete users' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    const recordToDelete = await userRepository.findOne({
      where: { id },
    });

    if (!recordToDelete) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    await userRepository.remove(recordToDelete);

    return res.status(200).json({ message: 'Record deleted successfully.' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occurred while deleting the record.' });
  }
};

export const Login = errorHandler(async (req: Request, res: Response) => {
  const user = await userRepository.findOne({
    where: { email: req.body['email'] },
    relations: ['userType'],
  });
  if (!user) {
    return res.status(404).send({ message: 'User Not Found' });
  }
  const passwordMatch = await bcrypt.compare(req.body.password, user.password); // Compare with hashed password from the database
  if (!passwordMatch) {
    return res.status(401).send({ message: 'Password does not match' });
  }
  if (!user.isVerified) {
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: '1d' }
    );
    const confirmLink = `${process.env.APP_URL}/api/v1/confirm?token=${token}`;
    await sendEmail('confirm', user.email, {
      name: user.firstName,
      link: confirmLink,
    });
    return res.status(401).send({
      message: 'Please verify your email. Confirmation link has been sent.',
    });
  }

  if (user.userType.name === 'Vendor') {
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000);

    await userRepository.update(user.id, { twoFactorCode });

    await sendCode(user.email, 'Your 2FA Code', './templates/2fa.html', {
      name: user.firstName,
      twoFactorCode: twoFactorCode.toString(),
    });

    res
      .status(200)
      .json({ message: 'Please provide the 2FA code sent to your email.' });
  } else {
    const token = jwt.sign({ user }, process.env.JWT_SECRET as jwt.Secret, {
      expiresIn: '1h',
    });
    res.status(200).json({ token, message: 'Buyer Logged in successfully' });
  }
});

export const verify2FA = errorHandler(async (req: Request, res: Response) => {
  const { code } = req.body;
  const { userId } = req.params;

  const user = await userRepository.findOne({
    where: { id: Number(userId) },
    relations: ['userType'],
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (code !== user.twoFactorCode) {
    return res.status(401).json({ error: 'Invalid code' });
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: '1h',
  });
  return res.status(200).json({ token });
});
