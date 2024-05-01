import { Router } from 'express';
import {
  registerUser,
  getAllUsers,
  deleteAllUsers,
} from '../controller/userController';
const route = Router();
route.post('/register', registerUser);
route.get('/all-users', getAllUsers);
route.delete('/delete-allusers', deleteAllUsers);

export default route;
