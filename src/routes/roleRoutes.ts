import roleController from '../controller/roleController';
import { Router } from 'express';
import { checkRole } from '../middlewares/authorize';

const roleRouter = Router();

roleRouter.get('/get_roles', roleController.getRoles);
roleRouter.post('/create_role', roleController.createRole);
roleRouter.put('/update_role', roleController.updateRole);
roleRouter.delete('/delete_role/:id', roleController.deleteRole);
roleRouter.patch('/change_user_role', roleController.changeRole);
roleRouter.get('/test', checkRole(['Admin']), roleController.getRoles);

export default roleRouter;
