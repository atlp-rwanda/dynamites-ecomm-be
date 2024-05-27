import dbConnection, { DbConnection } from '../database/index';
import UserModel from '../database/models/userModel';
import request from 'supertest';
import app from '../app';

export async function beforeAllHook() {
  await DbConnection.instance.initializeDb();
  await dbConnection.synchronize(true) // This will drop all tables
}
export async function getAdminToken() {
  const userRepository = await DbConnection.connection.getRepository(UserModel);

  const formData = {
    name: 'Admin',
    permissions: ['Deactivate', 'Activate'],
  };

  await request(app).post('/api/v1/roles/create_role').send(formData);
  const userData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'admin@gmail.com',
    password: 'TestPassword123',
    userType: 'Admin',
  };
  await request(app).post('/api/v1/register').send(userData);

  const updatedUser = await userRepository.findOne({
    where: { email: userData.email },
  });

  if (!updatedUser) throw new Error('User not found');

  updatedUser.isVerified = true;
  await userRepository.save(updatedUser);

  const loginResponse = await request(app).post('/api/v1/login').send({
    email: userData.email,
    password: userData.password,
  });

  const adminToken = loginResponse.body.token;

  return adminToken;
}

// Get Vendor Token function
export async function getVendorToken(
  email: string = 'test1@gmail.com',
  password: string = 'TestPassword123',
  firstName: string = 'Test',
  lastName: string = 'User'
) {
  const userRepository = await DbConnection.connection.getRepository(UserModel);

  const formData = {
    name: 'Vendor',
    permissions: ['test-permission1', 'test-permission2'],
  };
  await request(app).post('/api/v1/roles/create_role').send(formData);

  const userData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    userType: 'vendor',
  };
  await request(app).post('/api/v1/register').send(userData);

  const updatedUser = await userRepository.findOne({
    where: { email: userData.email },
  });
  if (updatedUser) {
    updatedUser.isVerified = true;
    await userRepository.save(updatedUser);
  }

  await request(app).post('/api/v1/login').send({
    email: userData.email,
    password: userData.password,
  });

  const user = await userRepository.findOne({
    where: { email: userData.email },
  });
  if (!user) throw new Error('User not found');

  const verifyResponse = await request(app)
    .post(`/api/v1/verify2FA/${user.id}`)
    .send({
      code: user.twoFactorCode,
    });
  return verifyResponse.body.token;
}

export const getBuyerToken = async () => {
  const userRepository = await DbConnection.connection.getRepository(UserModel);
  const formData = {
    name: 'Buyer',
    permissions: ['test-permission1', 'test-permission2'],
  };
  await request(app).post('/api/v1/roles/create_role').send(formData);

  const userData = {
    firstName: 'Tester',
    lastName: 'Test',
    email: 'test4@gmail.com',
    password: 'TestPassword123',
    userType: 'buyer',
  };
  await request(app).post('/api/v1/register').send(userData);

  const updatedUser = await userRepository.findOne({
    where: { email: userData.email },
  });
  if (updatedUser) {
    updatedUser.isVerified = true;
    await userRepository.save(updatedUser);
  }

  const loginResponse = await request(app).post('/api/v1/login').send({
    email: userData.email,
    password: userData.password,
  });

  return loginResponse.body.token;
};

export async function afterAllHook() {
  await DbConnection.instance.disconnectDb();
}
