import { Router } from 'express';
import { IsLoggedIn } from '../middlewares/isLoggedIn';
import { checkRole } from '../middlewares/authorize';
import {
    getallNotification,
    deleteallNotification, 
    deletenotification,
    getvendorNotifications} from '../controller/notificationController'
const notificationRouter = Router();

notificationRouter.route('/vendor')
                .get(getallNotification)
                .delete(deleteallNotification)
notificationRouter.route('/vendor/:id')
                .delete(deletenotification)
                .get(IsLoggedIn,checkRole(['Vendor']),getvendorNotifications)

export default notificationRouter