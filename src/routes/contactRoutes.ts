import { Router } from 'express';

import { handleContact } from '../controller/contactController';

const contactRoutes = Router();

contactRoutes.route('/').post(handleContact);

export default contactRoutes;
