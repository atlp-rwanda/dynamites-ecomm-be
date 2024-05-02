import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
} from '../controller/userController';

const route = Router();
route.post('/register', registerUser);
route.get('/getAllUsers', getAllUsers);
route.get('/confirm', confirmEmail);
route.delete('/delete/:id', deleteUser);
route.delete('/deleteAllUsers', deleteAllUsers);

export default route;
