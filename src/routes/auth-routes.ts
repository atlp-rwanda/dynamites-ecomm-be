import { Router, Request, Response } from 'express';
const authRoutes = Router();
import passport = require('passport');

// auth with Google
authRoutes.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// callback route for google to redirect
authRoutes.get(
  '/google/redirect',
  passport.authenticate('google'),
  (req: Request, res: Response) => {
    return res.send(req.user);
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
  (req: Request, res: Response) => {
    res.send(req.user);
  }
);

// auth Logout
authRoutes.get('/logout', async (req: Request, res: Response) => {
  res.send('logging out');
});

export default authRoutes;
