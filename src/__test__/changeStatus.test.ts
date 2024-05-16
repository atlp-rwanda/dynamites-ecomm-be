import request from 'supertest';
import app from '../app';
import jwt from 'jsonwebtoken';
import UserModel from '../database/models/userModel';
import dbConnection from '../database';
import { afterAllHook, beforeAllHook } from './testSetup';
import { Role } from '../database/models/roleEntity';
beforeAll(beforeAllHook);
afterAll(afterAllHook);

const userRepository = dbConnection.getRepository(UserModel);
const createAdminRoleIfNotExist = async () => {
  let adminRole = await dbConnection
    .getRepository(Role)
    .findOne({ where: { name: 'Admin' } });

  if (!adminRole) {
    adminRole = await dbConnection.getRepository(Role).save({
      name: 'Admin',
      permissions: [],
    });
  }

  return adminRole;
};

describe('User Status Change Tests - Activation', () => {
  let adminToken: string;

  beforeAll(async () => {
    const adminRole = await createAdminRoleIfNotExist();
    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    const adminUser = new UserModel({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'AdminPassword123',
      userType: adminRole, // Assuming the user type is 'Admin'
    });
    await userRepository.save(adminUser);

    // Generate a token for the 'Admin' user
    adminToken = jwt.sign(
      {
        userId: adminUser.id,
        email: adminUser.email,
        userType: {
          id: adminUser.userType.id,
          name: adminUser.userType.name,
          permissions: adminUser.userType.permissions,
        },
      },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: '1d' }
    );
  });

  afterAll(async () => {
    // Disable foreign key checks
    await dbConnection.query('SET session_replication_role = replica');

    // Proceed with your cleanup logic
    // For example, deleting the 'Admin' user
    const adminUser = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });
    if (adminUser) {
      await userRepository.delete(adminUser.id);
    }

    // Re-enable foreign key checks
    await dbConnection.query('SET session_replication_role = primary');
  });

  it('should activate a user account', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'TestPassword123',
      userType: 'buyer',
    };

    await request(app).post('/api/v1/register').send(userData);

    const registeredUser = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (!registeredUser) {
      throw new Error('User not found in the database');
    }
    const userId = registeredUser.id;

    const response = await request(app)
      .put(`/api/v1/activate/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User account activated successfully');

    const updatedUser = await userRepository.findOne({ where: { id: userId } });
    if (!updatedUser) {
      throw new Error('User not found in the database after activation');
    }
    expect(updatedUser.status).toBe('active');
  });

  it('should return 404 when trying to activate a non-existent user', async () => {
    const nonExistentUserId = 999; // Assuming this ID does not exist in the database

    const response = await request(app)
      .put(`/api/v1/activate/${nonExistentUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});

describe('User Status Change Tests - Deactivation', () => {
  let adminToken: string;

  beforeAll(async () => {
    const adminRole = await createAdminRoleIfNotExist();
    if (!adminRole) {
      throw new Error('Admin role not found');
    }
    const adminUser = new UserModel({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'AdminPassword123',
      userType: adminRole,
    });
    await userRepository.save(adminUser);

    adminToken = jwt.sign(
      {
        userId: adminUser.id,
        email: adminUser.email,
        userType: {
          id: adminUser.userType.id,
          name: adminUser.userType.name,
          permissions: adminUser.userType.permissions,
        },
      },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: '1d' }
    );
  });

  afterAll(async () => {
    // Disable foreign key checks
    await dbConnection.query('SET session_replication_role = replica');

    // Proceed with your cleanup logic
    // For example, deleting the 'Admin' user
    const adminUser = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });
    if (adminUser) {
      await userRepository.delete(adminUser.id);
    }

    // Re-enable foreign key checks
    await dbConnection.query('SET session_replication_role = primary');
  });

  it('should deactivate a user account', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'TestPassword123',
      userType: 'buyer',
    };

    // Register a new user
    await request(app).post('/api/v1/register').send(userData);

    // Retrieve the user ID from the database after registration
    const registeredUser = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (!registeredUser) {
      throw new Error('User not found in the database');
    }
    const userId = registeredUser.id;

    // Deactivate user account with the 'Admin' token
    const response = await request(app)
      .put(`/api/v1/deactivate/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User account deactivated successfully');

    // Verify user status in the database
    const updatedUser = await userRepository.findOne({ where: { id: userId } });
    if (!updatedUser) {
      throw new Error('User not found in the database after deactivation');
    }
    expect(updatedUser.status).toBe('inactive');
  });

  it('should return 404 when trying to deactivate a non-existent user', async () => {
    const nonExistentUserId = 999; // Assuming this ID does not exist in the database

    const response = await request(app)
      .put(`/api/v1/deactivate/${nonExistentUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});

// import request from 'supertest';
// import app from '../app';
// import UserModel from '../database/models/userModel';
// import dbConnection from '../database';
// import { afterAllHook, beforeAllHook } from './testSetup';

// beforeAll(beforeAllHook);
// afterAll(afterAllHook);

// const userRepository = dbConnection.getRepository(UserModel);
// describe('User Status Change Tests', () => {
//   it('should register a new user and generate a user ID', async () => {
//     const existingUser = await userRepository.findOne({
//       where: { email: 'testuser@example.com' },
//     });

//     if (!existingUser) {
//       const userData = {
//         firstName: 'Test',
//         lastName: 'User',
//         email: 'testuser@example.com',
//         password: 'TestPassword123',
//         userType: 'buyer',
//       };

//       const response = await request(app)
//         .post('/api/v1/register')
//         .send(userData);

//       expect(response.status).toBe(201);
//       expect(response.body.message).toBe('User successfully registered');
//     }

//     const registeredUser = await userRepository.findOne({
//       where: { email: 'testuser@example.com' },
//     });
//     if (!registeredUser) {
//       throw new Error('User not found in the database');
//     }
//     expect(registeredUser.id).toBeGreaterThan(0);
//   });

//   it('should deactivate a user account', async () => {
//     const registeredUser = await userRepository.findOne({
//       where: { email: 'testuser@example.com' },
//     });
//     if (!registeredUser) {
//       throw new Error('User not found in the database');
//     }
//     const userId: number = registeredUser.id;

//     const response = await request(app)
//       .put(`/api/v1/deactivate/${userId}`)
//       .send();

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('User account deactivated successfully');
//     const updatedUser = await userRepository.findOne({ where: { id: userId } });
//     if (!updatedUser) {
//       throw new Error('User not found in the database after deactivation');
//     }
//     expect(updatedUser.status).toBe('inactive');
//   });

//   it('should activate a user account', async () => {
//     const registeredUser = await userRepository.findOne({
//       where: { email: 'testuser@example.com' },
//     });
//     if (!registeredUser) {
//       throw new Error('User not found in the database');
//     }
//     const userId: number = registeredUser.id;

//     const response = await request(app)
//       .put(`/api/v1/activate/${userId}`)
//       .send();

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('User account activated successfully');
//     const updatedUser = await userRepository.findOne({ where: { id: userId } });
//     if (!updatedUser) {
//       throw new Error('User not found in the database after activation');
//     }
//     expect(updatedUser.status).toBe('active');
//   });

//   it('should return 404 if user not found when deactivating', async () => {
//     const nonExistentUserId = 999;
//     const response = await request(app)
//       .put(`/api/v1/deactivate/${nonExistentUserId}`)
//       .send();

//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe('User not found');
//   });

//   it('should return 404 if user not found when activating', async () => {
//     const nonExistentUserId = 999;
//     const response = await request(app)
//       .put(`/api/v1/activate/${nonExistentUserId}`)
//       .send();

//     expect(response.status).toBe(404);
//     expect(response.body.message).toBe('User not found');
//   });
// });
