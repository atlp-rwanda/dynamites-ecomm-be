import request from 'supertest';
import express from 'express';
import { handleContact } from '../controller/contactController'; // Adjust the import path accordingly

const app = express();
app.use(express.json());
app.post('/api/v1/contact', handleContact);

describe('POST /api/v1/contact', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test'; // Ensure we're in test mode
  });

  it('should return 400 if name, email, or message is missing', async () => {
    await request(app)
      .post('/api/v1/contact')
      .send({ email: 'test@example.com', message: 'Hello' })
      .expect(400)
      .expect({ error: 'Name, email, and message are required' });
  });

  it('should send feedback successfully', async () => {
    await request(app)
      .post('/api/v1/contact')
      .send({ name: 'John Doe', email: 'john@example.com', message: 'Hello' })
      .expect(200)
      .expect({ message: 'Feedback sent successfully' });
  });

  // Since we're not testing the actual email sending functionality here,
  // there's no need for a test that simulates failure to send feedback.
});
