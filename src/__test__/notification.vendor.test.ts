import request from 'supertest';
import app from '../app';
import { getVendorToken, afterAllHook, beforeAllHook } from './testSetup';
import Notification_box from '../database/models/inbox_notification';
import dbConnection from '../database';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Notification Controller Tests', () => {
  let token: string;
  let vendor_id: number;
  let notificationRepository;
  let notificationId: number;

  beforeAll(async () => {
    token = await getVendorToken();
    notificationRepository = dbConnection.getRepository(Notification_box);
   
    // make notification for test
    // ------------------------------------------
    const notification = new Notification_box();
    notification.product_id= 20;
    notification.vendor_email= 'ericniyibizi1998@gmail.com';
    notification.message_title = 'Test Notification';
    notification.message_content = 'This is a test notification';
    notification.vendor_id = 1; 
    const savedNotification = await notificationRepository.save(notification);
    // --------------------------------------------------
    notificationId = savedNotification.notification_id;
    vendor_id = savedNotification.vendor_id

    console.log(`Created notification with ID: ${notificationId}`);
  });

  it('should retrieve all notifications', async () => {
    const response = await request(app)
      .get('/api/v1/notification/vendor')

    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('Notification retrieved successfully');
    expect(Array.isArray(response.body.notification)).toBeTruthy();
    
  });

  it('should retrieve notifications by vendor ID', async () => {
    const response = await request(app)
      .get(`/api/v1/notification/vendor/${vendor_id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('Notifications retrieved successfully');
    expect(Array.isArray(response.body.notification)).toBeTruthy();
  });

  it('should delete all notifications', async () => {
    const response = await request(app)
      .delete('/api/v1/notification/vendor')

    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toEqual('All notifications deleted successfully');
  });

  it('should delete a notification by ID', async () => {
    const response = await request(app).delete(`/api/v1/notification/vendor/53`)
      
    expect(response.statusCode).toEqual(200);
  });


});
