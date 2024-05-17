
import { Router } from 'express';
import { activateAccount, deactivateAccount } from '../controller/changestatusController';
import { checkRole } from '../middlewares/authorize';
import { IsLoggedIn } from '../middlewares/isLoggedIn';

const route = Router();

route.put(
  '/activate/:userId',
  IsLoggedIn,
  checkRole(['Admin']),
  activateAccount
);

route.put(
  '/deactivate/:userId',
  IsLoggedIn,
  checkRole(['Admin']),
  deactivateAccount
);

export default route;
