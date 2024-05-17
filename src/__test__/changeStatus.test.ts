import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook, getAdminToken } from './testSetup';
import dbConnection from '../database';
import UserModel from '../database/models/userModel';

beforeAll(beforeAllHook);
afterAll(afterAllHook);
let adminToken: string;
let userId: number;

describe('Change Status Controller Tests', () => {
  const userRepository = dbConnection.getRepository(UserModel);

  beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  enum Status {
    Active = 'active',
    Inactive = 'inactive',
  }

  describe('Activate Account', () => {
    it('should activate an account given a valid userId', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'TestPassword123',
        status: Status.Inactive,
      };
      const createdUser = await userRepository.create(userData);

      await userRepository.save(createdUser);
      userId = createdUser.id;

      const activateResponse = await request(app)
        .put(`/api/v1/activate/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(activateResponse.statusCode).toEqual(200);
      expect(activateResponse.body.message).toEqual(
        'User account activated successfully'
      );
    });

    it('should return 404 if the user is not found', async () => {
      const nonExistentUserId = 9999;

      const response = await request(app)
        .put(`/api/v1/activate/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('User not found');
    });

    it('should return 400 if there are validation errors', async () => {
      const invalidUserId = 'invalid';

      const response = await request(app)
        .put(`/api/v1/activate/${invalidUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 if the user account is already active', async () => {
      const activeUser = await userRepository.create({
        firstName: 'Active',
        lastName: 'User',
        email: 'activeuser@example.com',
        password: 'TestPassword123',
        status: Status.Active,
      });
      await userRepository.save(activeUser);

      const response = await request(app)
        .put(`/api/v1/activate/${activeUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual('User account is already active');
    });
  });

  describe('Deactivate Account', () => {
    it('should deactivate an account given a valid userId', async () => {
      const deactivateResponse = await request(app)
        .put(`/api/v1/deactivate/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(deactivateResponse.statusCode).toEqual(200);
      expect(deactivateResponse.body.message).toEqual(
        'User account deactivated successfully'
      );
    });

    it('should return 404 if the user is not found', async () => {
      const nonExistentUserId = 9999;

      const response = await request(app)
        .put(`/api/v1/deactivate/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual('User not found');
    });

    it('should return 400 if there are validation errors', async () => {
      const invalidUserId = 'invalid';

      const response = await request(app)
        .put(`/api/v1/deactivate/${invalidUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 if the user account is already inactive', async () => {
      const inactiveUser = await userRepository.create({
        firstName: 'Inactive',
        lastName: 'User',
        email: 'inactiveuser@example.com',
        password: 'TestPassword123',
        status: Status.Inactive,
      });
      await userRepository.save(inactiveUser);

      const response = await request(app)
        .put(`/api/v1/deactivate/${inactiveUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual('User account is already inactive');
    });
  });
});