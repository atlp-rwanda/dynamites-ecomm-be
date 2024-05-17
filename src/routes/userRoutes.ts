import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  Login,
  verify2FA,
} from '../controller/userController';
const userRouter = Router();
userRouter.post('/register', registerUser);
userRouter.get('/confirm', confirmEmail);
userRouter.post('/login',Login);
userRouter.post('/verify2FA/:userId', verify2FA);

export default userRouter;
