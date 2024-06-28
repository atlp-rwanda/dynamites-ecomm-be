import { Router, Request, Response } from 'express';
const authRoutes = Router();
import passport = require('passport');
import jwt from 'jsonwebtoken';
import { sendCode } from '../emails/mailer';
import UserModel from '../database/models/userModel';
import dbConnection from '../database';

const userRepository = dbConnection.getRepository(UserModel);

// auth with Google
authRoutes.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// callback route for google to redirect
authRoutes.get(
  '/google/redirect',
  passport.authenticate('google'),
  async (req: Request, res: Response) => {
    const user = req.user!;
    // checking if a user is a Vendor
    if (user.userType.name === 'Vendor') {
      const twoFactorCode = Math.floor(100000 + Math.random() * 900000);
      await userRepository.update(user.id, { twoFactorCode });
      if (process.env.NODE_ENV !== 'test') {
        await sendCode(user.email, 'Your 2FA Code', './templates/2fa.html', {
          name: user.firstName,
          twoFactorCode: twoFactorCode.toString(),
        });
      }
      return res.status(200).json({
        message: 'Please provide the 2FA code sent to your email.',
        user: { id: user.id, email: user.email },
      });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as jwt.Secret, {
      expiresIn: '7d',
    });

    return res.json({
      token: token,
    });
  }
);

// auth with Facebook
authRoutes.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

// callback route for Facebook to redirect
authRoutes.get(
  '/facebook/redirect',
  passport.authenticate('facebook'),
  async (req: Request, res: Response) => {
    const user = req.user!;
    // checking if a user is a Vendor
    if (user.userType.name === 'Vendor') {
      const twoFactorCode = Math.floor(100000 + Math.random() * 900000);
      await userRepository.update(user.id, { twoFactorCode });
      if (process.env.NODE_ENV !== 'test') {
        await sendCode(user.email, 'Your 2FA Code', './templates/2fa.html', {
          name: user.firstName,
          twoFactorCode: twoFactorCode.toString(),
        });
      }
      return res.status(200).json({
        message: 'Please provide the 2FA code sent to your email.',
        user: { id: user.id, email: user.email },
      });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as jwt.Secret, {
      expiresIn: '7d',
    });

    return res.json({
      token: token,
    });
  }
);

// auth Logout
authRoutes.get('/logout', async (req: Request, res: Response) => {
  res.send('logging out');
});

export default authRoutes;
