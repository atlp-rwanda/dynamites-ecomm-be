import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
  Login,
  verify2FA,
  recoverPassword,
  updateNewPassword,
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
userRouter.get('/getAllUsers', getAllUsers);
userRouter.delete('/delete/:id', deleteUser);
userRouter.delete('/deleteAllUsers', deleteAllUsers);
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
userRouter.post('/recover/confirm/:recoverToken', updateNewPassword);

export default userRouter;
