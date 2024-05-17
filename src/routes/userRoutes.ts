import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
  Login,
  verify2FA,
  updateProfile,
  recoverPassword,
  updateNewPassword,
} from '../controller/userController';

const route = Router();
route.post('/register', registerUser);
route.get('/getAllUsers', getAllUsers);
route.get('/confirm', confirmEmail);
route.delete('/delete/:id', deleteUser);
route.delete('/deleteAllUsers', deleteAllUsers);
route.post('/login',Login)
route.get('/all-users', getAllUsers);
route.post('/verify2FA/:userId', verify2FA);
route.post('/recover', recoverPassword);
route.post('/recover/confirm', updateNewPassword);
route.put('/updateProfile/:id', updateProfile);

export default route;

