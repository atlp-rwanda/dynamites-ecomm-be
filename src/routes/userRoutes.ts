import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  Login,
  verify2FA,
  recoverPassword,
  updateNewPassword,
  getAllUsers,
  deleteAllUsers,
  updateProfile,
  deleteUser,
  changeProfileImg,
  removeProfileImg
} from '../controller/userController';

import {
  activateAccount,
  deactivateAccount,
} from '../controller/changestatusController';
import { checkRole } from '../middlewares/authorize';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import upload from '../middlewares/multer'

const userRouter = Router();
userRouter.post('/register', registerUser);
userRouter.get('/confirm', confirmEmail);
userRouter.post('/login', Login);
userRouter.post('/verify2FA/:userId', verify2FA);
userRouter.get('/getAllUsers', getAllUsers);
userRouter.delete('/deleteUsers', deleteAllUsers);
userRouter.delete('/delete/:userId', deleteUser);
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
userRouter.put('/recover/confirm', updateNewPassword);

userRouter.put('/updateProfile/:id', updateProfile);
userRouter.route('/profileImg').patch(IsLoggedIn, upload.fields([{name:'image'}]), changeProfileImg).delete(IsLoggedIn, removeProfileImg)
export default userRouter;
