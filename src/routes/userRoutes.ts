import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
  Login
} from '../controller/userController';

const route = Router();
route.post('/register', registerUser);
route.get('/getAllUsers', getAllUsers);
route.get('/confirm', confirmEmail);
route.delete('/delete/:id', deleteUser);
route.delete('/deleteAllUsers', deleteAllUsers);
route.post('/login',Login)
route.get('/all-users', getAllUsers);

export default route;

