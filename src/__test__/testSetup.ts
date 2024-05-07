import { DbConnection } from '../database/index';
import UserModel from '../database/models/userModel';
import { Role } from '../database/models';
import Category from '../database/models/categoryEntity';
import Product from '../database/models/productEntity';
import request from 'supertest';
import app from '../app';

export async function beforeAllHook() {
  await DbConnection.instance.initializeDb();

  // Get repositories
  const userRepository = await DbConnection.connection.getRepository(UserModel);
  const roleRepository = await DbConnection.connection.getRepository(Role);
  const categoryRepository =
    await DbConnection.connection.getRepository(Category);
  const productRepository =
    await DbConnection.connection.getRepository(Product);

  // Delete all users,roles and categories
  await userRepository.createQueryBuilder().delete().execute();
  await roleRepository.createQueryBuilder().delete().execute();
  await categoryRepository.createQueryBuilder().delete().execute();
  await productRepository.createQueryBuilder().delete().execute();
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
  const roleResponse = await request(app)
    .post('/api/v1/roles/create_role')
    .send(formData);

  const userData = {
    firstName: 'Tester',
    lastName: 'Test',
    email: 'test4@gmail.com',
    password: 'TestPassword123',
    userType: 'buyer',
  };
  const res = await request(app).post('/api/v1/register').send(userData);

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
    const categoryRepository = transactionManager.getRepository(Category);
    const productRepository = transactionManager.getRepository(Product);
    const roleRepository = transactionManager.getRepository(Role);

    await userRepository.createQueryBuilder().delete().execute();
    await categoryRepository.createQueryBuilder().delete().execute();
    await productRepository.createQueryBuilder().delete().execute();
    await roleRepository.createQueryBuilder().delete().execute();
  });
  await DbConnection.instance.disconnectDb();
}
