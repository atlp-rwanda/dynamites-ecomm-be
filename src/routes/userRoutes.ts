import { Router } from 'express';
import {
  registerUser,
  confirmEmail,
  deleteAllUsers,
  getAllUsers,
  deleteUser,
  Login,
  verify2FA,
<<<<<<< HEAD
  updateProfile
=======
  recoverPassword,
  updateNewPassword,
>>>>>>> 4979604 (* feat(rbac): Implement role based access control)
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
<<<<<<< HEAD
=======
route.post('/recover', recoverPassword);
route.post('/recover/confirm', updateNewPassword);
>>>>>>> 4979604 (* feat(rbac): Implement role based access control)

route.put('/updateProfile/:id',updateProfile);
export default route;

