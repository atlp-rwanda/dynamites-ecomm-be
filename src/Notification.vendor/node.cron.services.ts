import { EventEmitter } from 'events';
import Notification_box from '../database/models/inbox_notification';
import Product from '../database/models/productEntity';
import { Order } from '../database/models/orderEntity';
import dbConnection from '../database';
import sendEmailfunc from './EmailSendor';
import cron from 'node-cron';
import { 
   product_not_availble,
   expiried_order} from './message.Templete';

export const eventEmitter = new EventEmitter();

const productRepository = dbConnection.getRepository(Product);
const NotificationRepository = dbConnection.getRepository(Notification_box);
const orderRepository = dbConnection.getRepository(Order);


const dailyTasks = cron.schedule('0 0 * * *', async () => {
    
    const orders = await orderRepository.find();
    for (const order of orders) {
        const createdAt = new Date(order.createdAt);
        const now = new Date();
        const timeDiff = now.getTime() - createdAt.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (diffDays >= 0.1 && order.status !== 'Canceled') {
            order.status = 'Canceled';
            await orderRepository.save(order);
            
            // *************************************************************************

            const orderDetail = order.orderDetails  
            
            for(let i=0; i<orderDetail.length; i++)
            {
                const product = await productRepository.findOne({
                where: { id: orderDetail[i].product.id},
                select: { vendor: { firstName: true, lastName: true, picture: true, id: true, email: true } },
                relations: ['vendor'],
                });

                if(!product || !product.vendor || !product.vendor.email)
                {
                    return
                }

                else if (!product.vendor || !product.vendor.email) 
                    {
                      return
                    }
                const new_notification = new Notification_box();
                new_notification.product_id = orderDetail[i].product.id;
                new_notification.vendor_id = product.vendor.id
                new_notification.vendor_email = product.vendor.email;
                new_notification.message_title = 'order with you product was placed';
                new_notification.message_content = expiried_order(product, order);

                await NotificationRepository.save(new_notification);
                
                console.log('press order notification created')
                sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)
                }      

                console.log(`Order ${order.id} cancelled due to expiry.`);
        }
    }
    
    const unavailableProducts = await productRepository.find({ where: { isAvailable: false } });
    for (const product of unavailableProducts) {
        if(!product || !product.vendor)
            {
                continue
            }
         
        else if (!product.vendor || !product.vendor.email) 
                {
                  continue
                }   

        const new_notification = new Notification_box();
        new_notification.product_id = product.id
        new_notification.vendor_id = product.vendor.id
        new_notification.vendor_email = product.vendor.email;
        new_notification.message_title = 'Your Product is UnAvailable';
        new_notification.message_content = product_not_availble(product);
    
        await NotificationRepository.save(new_notification);
        
        console.log('press order notification created')
        sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)
    }
});

export default dailyTasks