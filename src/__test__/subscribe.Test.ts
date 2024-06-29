import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
import dbConnection from '../database';
import Subscription from '../database/models/subscribe';

const subscribeRepository = dbConnection.getRepository(Subscription);

beforeAll(async () => {
  await beforeAllHook();
});

afterAll(async () => {
  await afterAllHook();
});

describe('POST /api/v1/subscribe', () => {
  beforeEach(async () => {
    // Clear the table before each test
    await subscribeRepository.clear();
  });

  it('should subscribe successfully with a valid email', async () => {
    const response = await request(app)
      .post('/api/v1/subscribe')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Subscribed successfully');
    expect(response.body.subscription.email).toBe('test@example.com');

    const subscription = await subscribeRepository.findOne({
      where: { email: 'test@example.com' },
    });
    expect(subscription).toBeDefined();
  });

  it('should return 400 if the email is already subscribed', async () => {
    const subscription = new Subscription();
    subscription.email = 'test@example.com';
    await subscribeRepository.save(subscription);

    const response = await request(app)
      .post('/api/v1/subscribe')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is already subscribed');
  });

  it('should return 400 for an invalid email format', async () => {
    const response = await request(app)
      .post('/api/v1/subscribe')
      .send({ email: 'invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('Email is not valid');
  });
});

describe('DELETE /api/v1/subscribe/delete/:id', () => {
  beforeEach(async () => {
    // Clear the table before each test
    await subscribeRepository.clear();
  });

  it('should remove a subscription successfully', async () => {
    const subscription = new Subscription();
    subscription.email = 'test@example.com';
    await subscribeRepository.save(subscription);

    const response = await request(app)
      .get(`/api/v1/subscribe/delete/${subscription.id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Subscription removed successfully');
  });

  it('should return 404 if the subscription does not exist', async () => {
    const response = await request(app)
      .get('/api/v1/subscribe/delete/450')
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Subscription not found');
  });

  it('should return 400 for invalid ID', async () => {
    const response = await request(app)
      .get('/api/v1/subscribe/delete/noid')
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBeUndefined();
  });
});

describe('GET /api/v1/subscribe/getAll', () => {
  beforeEach(async () => {
    await subscribeRepository.clear();
  });

  it('should return all subscriptions', async () => {
    const subscription1 = new Subscription();
    subscription1.email = 'test1@example.com';
    await subscribeRepository.save(subscription1);

    const subscription2 = new Subscription();
    subscription2.email = 'test2@example.com';
    await subscribeRepository.save(subscription2);

    const response = await request(app).get('/api/v1/subscribe/getAll').send();

    expect(response.status).toBe(200);
    expect(response.body.subscription).toHaveLength(2);
    expect(response.body.subscription).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: 'test1@example.com' }),
        expect.objectContaining({ email: 'test2@example.com' }),
      ])
    );
  });
});
