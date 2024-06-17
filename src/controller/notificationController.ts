import { Request, Response } from 'express';
import Notification_box from '../database/models/inbox_notification';
import dbConnection from '../database';
import errorHandler from '../middlewares/errorHandler';
const NotificationRepository = dbConnection.getRepository(Notification_box)



export const getallNotification= errorHandler(
    async(req:Request, res:Response)=>{

    const notification = await NotificationRepository.find()

    if(!notification)
        {
            return res.status(400).json({msg:'notification is empty'})
        }


    return res.status(200).json({msg:'Notification retrieved successfully', notification})
    
}
)

export const deleteallNotification = errorHandler(
    async (req: Request , res: Response)=>{
        const Notication = await NotificationRepository.find()
        if(!Notication)
            {
                return res.status(400).json({msg:'notification is empty'})
            }
        
        await NotificationRepository.remove(Notication)

        return res.status(200).json({msg:'All notifications deleted successfully'})
    }

)

export const deletenotification = errorHandler(
    async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);

        const notification = await NotificationRepository.findOne({
            where: { notification_id: id }
        });
       

        if (!notification) {
            return res.status(400).json({ msg: 'No Notifications was found' });
        }

        await NotificationRepository.remove(notification);
        return res.status(200).json({ msg: 'Notification removed successfully' });
    }
);

export const getvendorNotifications = errorHandler(
    async (req: Request, res:Response)=>{
            
        const id:number= parseInt(req.params.id)

        const notification = await NotificationRepository.find({
           where:{vendor_id:id}})
           
        if(!notification)
           {
           return res.status(400).json({msg: 'No Notifications was found'})
           }
       
       return res.status(200).json({msg:'Notifications retrieved successfully',notification})
   }
)