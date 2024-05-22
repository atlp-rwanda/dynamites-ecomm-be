import { DbConnection } from '../database/index';
import UserModel from '../database/models/userModel';
import { Role } from '../database/models';
import Category from '../database/models/categoryEntity';
import Product from '../database/models/productEntity';
import request from 'supertest';
import app from '../app';

export async function beforeAllHook() {
  await DbConnection.instance.initializeDb();

  const userRepository = DbConnection.connection.getRepository(UserModel);
  const roleRepository = DbConnection.connection.getRepository(Role);
  const categoryRepository = DbConnection.connection.getRepository(Category);
  const productRepository = DbConnection.connection.getRepository(Product);

  await userRepository.createQueryBuilder().delete().execute();
  await roleRepository.createQueryBuilder().delete().execute();
  await categoryRepository.createQueryBuilder().delete().execute();
  await productRepository.createQueryBuilder().delete().execute();
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

export async function getVendorToken() {
  const userRepository = await DbConnection.connection.getRepository(UserModel);
  const formData = {
    name: 'Vendor',
    permissions: ['test-permission1', 'test-permission2'],
  };
  await request(app).post('/api/v1/roles/create_role').send(formData);

  const userData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test1@gmail.com',
    password: 'TestPassword123',
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

  const loginResponse = await request(app).post('/api/v1/login').send({
    email: userData.email,
    password: userData.password,
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.message).toBe(
    'Please provide the 2FA code sent to your email.'
  );

  const user = await userRepository.findOne({
    where: { email: userData.email },
  });
  if (!user) throw new Error('User not found');

  const verifyResponse = await request(app)
    .post(`/api/v1/verify2FA/${user.id}`)
    .send({
      code: user.twoFactorCode,
    });
  expect(verifyResponse.status).toBe(200);
  expect(verifyResponse.body).toHaveProperty('token');
  expect(verifyResponse.body.token).toBeDefined();
  return verifyResponse.body.token;
}

export const getBuyerToken = async () => {
  const userRepository = await DbConnection.connection.getRepository(UserModel);
  const formData = {
    name: 'Buyer',
    permissions: ['test-permission1', 'test-permission2'],
  };
  await request(app)
    .post('/api/v1/roles/create_role')
    .send(formData);

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
  await DbConnection.connection.transaction(async (transactionManager) => {
    const userRepository = transactionManager.getRepository(UserModel);
    const roleRepository = transactionManager.getRepository(Role);
    const categoryRepository = transactionManager.getRepository(Category);
    const productRepository = transactionManager.getRepository(Product);

    await userRepository.createQueryBuilder().delete().execute();
    await roleRepository.createQueryBuilder().delete().execute();

    await categoryRepository.createQueryBuilder().delete().execute();
    await productRepository.createQueryBuilder().delete().execute();
    await userRepository.createQueryBuilder().delete().execute();
  });
  await DbConnection.instance.disconnectDb();
}
