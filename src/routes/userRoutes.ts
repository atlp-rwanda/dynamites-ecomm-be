import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
  Login,
  verify2FA,
  updateProfile
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

route.put('/updateProfile/:id',updateProfile);
export default route;

