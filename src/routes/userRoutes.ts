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
import {
  deactivateAccount,
  activateAccount,
} from '../controller/changestatusController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
const route = Router();
route.put('/deactivate/:userId', IsLoggedIn, deactivateAccount);
route.put('/activate/:userId', IsLoggedIn, activateAccount);
route.post('/register', registerUser);
route.get('/getAllUsers', getAllUsers);
route.get('/confirm', confirmEmail);
route.delete('/delete/:id', deleteUser);
route.delete('/deleteAllUsers', deleteAllUsers);
route.post('/login', Login);
route.get('/all-users', getAllUsers);
route.post('/verify2FA/:userId', verify2FA);

export default route;