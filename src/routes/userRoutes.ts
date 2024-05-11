import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
  Login,
  verify2FA,
} from '../controller/userController';

const userRouter = Router();
userRouter.post('/register', registerUser);
userRouter.get('/getAllUsers', getAllUsers);
userRouter.get('/confirm', confirmEmail);
userRouter.delete('/delete/:id', deleteUser);
userRouter.delete('/deleteAllUsers', deleteAllUsers);
userRouter.post('/login', Login);
userRouter.post('/verify2FA/:userId', verify2FA);

export default userRouter;
