import { Router } from 'express';
import { createService, getAllServices } from '../controller/serviceController';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';

const router = Router();

router.post('/service', 
// IsLoggedIn, checkRole(['Admin']),
 createService);

router.get('/services', IsLoggedIn, checkRole(['Buyer']), getAllServices);

export default router;
