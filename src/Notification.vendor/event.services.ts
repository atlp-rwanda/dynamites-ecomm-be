import { EventEmitter } from 'events';
import Notification_box from '../database/models/inbox_notification';
import UserModel from '../database/models/userModel';
import Product from '../database/models/productEntity';
import { Order } from '../database/models/orderEntity';
import dbConnection from '../database';
import sendEmailfunc from './EmailSendor';
import { 
   added_to_cart_message,
   removed_to_cart_message,
   pressorder_message, 
   order_status_changed, 
   new_product_created, 
   updated_Product,
   product_deleted,
  order_canceled} from './message.Templete';

export const eventEmitter = new EventEmitter();


interface product {
  id: number;
  name: string;
  image: string;
  gallery: string[];
  shortDesc: string;
  longDesc: string;
  quantity: number;
  regularPrice: number;
  salesPrice: number;
  tags: string[];
  type: string;
  isAvailable: boolean;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
  vendor: UserModel;
}

interface order {
  id: number;
  user: UserModel | null;
  totalAmount: number;
  status: string;
  deliveryInfo: string | null;
  trackingNumber: string;
  createdAt: Date;
  updatedAt: Date;
  orderDetails: OrderDetails[];
  paid: boolean | null;
}

interface OrderDetails {
  id: number;
  order: Order;
  product: Product;
  quantity: number;
  price: number;
}

const productRepository = dbConnection.getRepository(Product);
const userRepository = dbConnection.getRepository(UserModel);
const NotificationRepository = dbConnection.getRepository(Notification_box);
const orderRepository = dbConnection.getRepository(Order);

eventEmitter.on('addToCart', async (product_id, userId) => {
  try {
    
    const product = await productRepository.findOne({
      where: { id: product_id },
      select: { vendor: { firstName: true, lastName: true, picture: true, id: true, email: true } },
      relations: ['vendor'],
    });

    if (!product) {
      return;
    }
  
    else if (!product.vendor || !product.vendor.email) 
      {
        return
      }

    const User = await userRepository.findOne({
      where: { id: userId }
    });

    if (!User) {
      return;
    }

    const new_notification = new Notification_box();
    new_notification.product_id = product.id;
    new_notification.vendor_id = product.vendor.id;
    new_notification.vendor_email = product.vendor.email;
    new_notification.message_title = 'your product is add to buyer cart';
    new_notification.message_content = added_to_cart_message(product, User);
    await NotificationRepository.save(new_notification);
    sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)
  } catch (error) {
    throw error
  }
});

eventEmitter.on('removeItem', async (removeItem) => {
  try {

    const product = await productRepository.findOne({
      where: { id: removeItem.product.id },
      select: { vendor: { firstName: true, lastName: true, picture: true, id: true, email: true } },
      relations: ['vendor'],
    });

    if (!product) {
      return;
    }

    else if (!product.vendor || !product.vendor.email) 
      {
        return
      }
    const user = await userRepository.findOne({
      where: { id: removeItem.user.id }
    });

    if (!user) {
      return;
    }

    const new_notification = new Notification_box();
    new_notification.product_id = product.id;
    new_notification.vendor_id = product.vendor.id;
    new_notification.vendor_email = product.vendor.email;
    new_notification.message_title = 'your product is removed to buyer cart';
    new_notification.message_content = removed_to_cart_message(product, user);

    await NotificationRepository.save(new_notification);
    sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)

  } catch (error) {
    throw error
  }
});

eventEmitter.on('pressorder', async (order:order) => {
  try {
     const orderDetail = order.orderDetails  
     for(let i=0; i<orderDetail.length; i++)
      {
        const product = await productRepository.findOne({
          where: { id: orderDetail[i].product.id},
          select: { vendor: { firstName: true, lastName: true, picture: true, id: true, email: true } },
          relations: ['vendor'],
        });

        if(!product)
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
        new_notification.message_content = pressorder_message(product, order);

        await NotificationRepository.save(new_notification);
        
        sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)
      }
     
    }
  catch (error) {
    throw error
  }
});

eventEmitter.on('order_status_change', async (orderId:number) => {
  try {

    const order = await orderRepository.findOne({
      where: {
        id: orderId,
      },
      relations:['orderDetails','orderDetails.product']
    });
    if(order == null)
      {
        console.log('order is null')
        return
      }
     const orderDetail = order.orderDetails  
     
     for(let i=0; i<orderDetail.length; i++)
      {
        const product = await productRepository.findOne({
          where: { id: orderDetail[i].product.id},
          select: { vendor: { firstName: true, lastName: true, picture: true, id: true, email: true } },
          relations: ['vendor'],
        });

        if(!product || !product.vendor)
          {
            continue
          }
        else if (!product.vendor || !product.vendor.email) 
            {
              continue
            }
        const new_notification = new Notification_box();
        new_notification.product_id = orderDetail[i].product.id;
        new_notification.vendor_id = product.vendor.id
        new_notification.vendor_email = product.vendor.email;
        new_notification.message_title = 'order status with you product was changed';
        new_notification.message_content = order_status_changed(product, order);

        await NotificationRepository.save(new_notification);
        sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)
      }
    
    }
  catch (error) {
    throw error
  }
});


eventEmitter.on('productCreated', async(product:product)=>{
  try{
  
       if(!product)
        {
          return
        }
      
        else if (!product.vendor || !product.vendor.email) {
          return
      }

        const new_notification = new Notification_box();
        new_notification.product_id =product.id ;
        new_notification.vendor_id = product.vendor.id
        new_notification.vendor_email = product.vendor.email;
        new_notification.message_title = 'Your Product was created sucessfull';
        new_notification.message_content = new_product_created(product);

        await NotificationRepository.save(new_notification);
        sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)
  }
  catch(error)
  {
    throw error
  }

})

eventEmitter.on('product_updated', async(product:product)=>{

  try{

        if(!product)
          {
            return
          }
        else if (!product.vendor || !product.vendor.email) 
          {
            return
          }
        const new_notification = new Notification_box();
        new_notification.product_id =product.id ;
        new_notification.vendor_id = product.vendor.id
        new_notification.vendor_email = product.vendor.email;
        new_notification.message_title = 'Your product was Updated succesfull';
        new_notification.message_content = updated_Product(product);

        await NotificationRepository.save(new_notification);
        sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)
  }
  catch(error)
  {
    throw error
  }
})


eventEmitter.on('product_deleted', async(product_id:number)=>{
  try{

        const product= await productRepository.findOne({
          where:{id: product_id},
          relations:['vendor']
        })
        if(!product || !product.vendor || !product.vendor.email)
          {
            return
          }
         
        else if (!product.vendor || !product.vendor.email) 
            {
              return
            }  
        const new_notification = new Notification_box();
        new_notification.product_id =product.id ;
        new_notification.vendor_id = product.vendor.id
        new_notification.vendor_email = product.vendor.email;
        new_notification.message_title = 'Your product was Updated succesfull';
        new_notification.message_content = product_deleted(product);

        await NotificationRepository.save(new_notification);
        sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)
  }
  catch(error)
  {
    throw error
  }
})


eventEmitter.on('order_canceled', async (orderId) => {
  try {
    
    const order = await orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderDetails','orderDetails.product', 'orderDetails.product.vendor'],
    });
     if(!order)
      {
        return
      }
     const orderDetail = order.orderDetails
     
     for(let i=0; i<orderDetail.length; i++)
      {
        const product = await productRepository.findOne({
          where: { id: orderDetail[i].product.id},
          select: { vendor: { firstName: true, lastName: true, picture: true, id: true, email: true } },
          relations: ['vendor'],
        });

        if(!product)
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
        new_notification.message_content = order_canceled(product, order);

        await NotificationRepository.save(new_notification);
        
        sendEmailfunc(product.vendor.email, new_notification.message_title, new_notification.message_content)
      }
     
    }
  catch (error) {
    throw error
  }
});
