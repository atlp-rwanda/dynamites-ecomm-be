import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  Login,
  verify2FA,
  recoverPassword,
  updateNewPassword
} from '../controller/userController';

import {
  activateAccount,
  deactivateAccount,
} from '../controller/changestatusController';
import { checkRole } from '../middlewares/authorize';
import { IsLoggedIn } from '../middlewares/isLoggedIn';



const userRouter = Router();
userRouter.post('/register', registerUser);
userRouter.get('/confirm', confirmEmail);
userRouter.post('/login', Login);
userRouter.post('/verify2FA/:userId', verify2FA);
userRouter.put(
  '/activate/:userId',
  IsLoggedIn,
  checkRole(['Admin']),
  activateAccount
);

userRouter.put(
  '/deactivate/:userId',
  IsLoggedIn,
  checkRole(['Admin']),
  deactivateAccount
);

userRouter.post('/recover', recoverPassword);
userRouter.post('/recover/confirm/', updateNewPassword);

export default userRouter;
