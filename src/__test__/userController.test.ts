import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
import jwt from 'jsonwebtoken';
import dbConnection from '../database';
import UserModel from '../database/models/userModel';
const userRepository = dbConnection.getRepository(UserModel);

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('User Registration Tests', () => {
  it('should register a new user with valid data', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'TestPassword123',
      userType: 'buyer',
    };
    const response = await request(app).post('/api/v1/register').send(userData);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User successfully registered');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('firstName', userData.firstName);
    expect(response.body.user).toHaveProperty('lastName', userData.lastName);
    expect(response.body.user).toHaveProperty('email', userData.email);
    expect(response.body.user).toHaveProperty(
      'userType',
      response.body.user.userType
    );
  });

  it('should return a 400 status code if validation fails', async () => {
    const invalidData = {
      firstName: '',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'TestPassword',
      userType: 'buyer',
    };

    const response = await request(app)
      .post('/api/v1/register')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toBe('First name is required');
  });

  it('should return a 409 status code if the email already exists', async () => {
    // Setup: Ensure a user with the specified email exists
    const existingUserData = {
      firstName: 'Existing',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'ExistingPassword123',
      userType: 'buyer',
    };
    await request(app).post('/api/v1/register').send(existingUserData);

    // Test: Attempt to register a new user with the same email
    const userData = {
      firstName: 'Existing',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'ExistingPassword123',
      userType: 'buyer',
    };

    const response = await request(app).post('/api/v1/register').send(userData);
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already exists');
  });

  it('should confirm user email with a valid token', async () => {
    const formData = {
      name: 'test-role',
      permissions: ['test-permission1', 'test-permission2'],
    };

    const roleResponse = await request(app)
      .post('/api/v1/roles/create_role')
      .send(formData);
    // Create a new user
    const newUser = new UserModel({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'TestPassword123',
      userType: roleResponse.body.role,
    });
    await dbConnection.getRepository(UserModel).save(newUser);

    // Generate a token for the user
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: '1d' }
    );

    // Send a request to confirm the email with the token
    const response = await request(app).get(`/api/v1/confirm?token=${token}`);

    // Check the response
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email confirmed successfully');

    // Check if the user's email is now verified
    const updatedUser = await dbConnection
      .getRepository(UserModel)
      .findOne({ where: { id: newUser.id } });

    expect(updatedUser?.isVerified).toBe(true);
  });

  it('should return a 400 status code with invalid or expired token', async () => {
    // Send a request with an invalid or expired token
    const invalidToken = 'invalid_token';
    const response = await request(app).get(
      `/api/v1/confirm?token=${invalidToken}`
    );

    // Check the response
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid or expired token');
  });

  it('should return a 400 status code if token is missing', async () => {
    // Send a request without a token
    const response = await request(app).get('/api/v1/confirm');

    // Check the response
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Token is required');
  });

  it('should return a 404 status code if the user is not found', async () => {
    const nonExistentUserId = 999;
    const token = jwt.sign(
      { userId: nonExistentUserId, email: 'nonexistent@example.com' },
      process.env.JWT_SECRET as jwt.Secret,
      { expiresIn: '1d' }
    );

    const response = await request(app).get(`/api/v1/confirm?token=${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});

describe('User Login Tests', () => {
  it('should log in a vendor with valid credentials', async () => {
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

      const loginResponse = await request(app).post('/api/v1/login').send({
        email: userData.email,
        password: userData.password,
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.message).toBe(
        'Please provide the 2FA code sent to your email.'
      );
    }
  });

  it('should verify the 2FA code for a vendor user', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test1@gmail.com',
      password: 'TestPassword123',
      userType: 'vendor',
    };

    // Register the user
    await request(app).post('/api/v1/register').send(userData);

    // Verify the user
    let user = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (user) {
      user.isVerified = true;
      await userRepository.save(user);
    }
    const loginResponse = await request(app).post('/api/v1/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.message).toBe(
      'Please provide the 2FA code sent to your email.'
    );

    user = await userRepository.findOne({ where: { email: userData.email } });

    if (user) {
      const verifyResponse = await request(app)
        .post(`/api/v1/verify2FA/${user.id}`)
        .send({
          code: user.twoFactorCode,
        });

      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body).toHaveProperty('token');
    }
  });

  it('should log in a buyer with valid credentials', async () => {
    const formData = {
      name: 'Buyer',
      permissions: ['test-permission1', 'test-permission2'],
    };

    // Create the role first
    const roleResponse = await request(app)
      .post('/api/v1/roles/create_role')
      .send(formData);

    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test2@gmail.com',
      password: 'TestPassword123',
      userType: roleResponse.body.id,
    };
    await request(app).post('/api/v1/register').send(userData);

    const updatedUser = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (updatedUser) {
      updatedUser.isVerified = true;
      await userRepository.save(updatedUser);

      const loginResponse = await request(app).post('/api/v1/login').send({
        email: userData.email,
        password: userData.password,
      });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();
      expect(loginResponse.body.message).toBe('Buyer Logged in successfully');

      // Decode the token and check its properties
      const decodedToken = jwt.decode(loginResponse.body.token);
      expect(decodedToken).toHaveProperty('user');
      expect(decodedToken).toHaveProperty('iat');
      expect(decodedToken).toHaveProperty('exp');
    }
  });

  it('should return a 401 status code if the email is not verified', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'TestPassword123',
      userType: 'buyer',
    };
    await request(app).post('/api/v1/register').send(userData);
    const updatedUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (updatedUser) {
      updatedUser.isVerified = false;
      await userRepository.save(updatedUser);
      const loginResponse = await request(app).post('/api/v1/login').send({
        email: userData.email,
        password: userData.password,
      });

      expect(loginResponse.status).toBe(401);
      expect(loginResponse.body.message).toBe(
        'Please verify your email. Confirmation link has been sent.'
      ); // Corrected message
    }
  });

  it('should return a 401 status code if the password does not match', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 'TestPassword123',
      userType: 'buyer',
    };
    await request(app).post('/api/v1/register').send(userData);

    const loginResponse = await request(app).post('/api/v1/login').send({
      email: userData.email,
      password: 'IncorrectPassword',
    });
    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body.message).toBe('Password does not match');
  });

  it('should return a 404 status code if the user is not found', async () => {
    const nonExistentEmail = 'nonexistent@example.com';
    const loginResponse = await request(app).post('/api/v1/login').send({
      email: nonExistentEmail,
      password: 'TestPassword123',
    });

    expect(loginResponse.status).toBe(404);
    expect(loginResponse.body.message).toBe('User Not Found');
  });
});


describe('Password Recover Tests', () => {
  const userData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@gmail.com',
    password: 'TestPassword123',
    userType: 'vendor'
  };
  it('should generate a password reset token and send an email', async () => {
    // Register a user
    await request(app).post('/api/v1/user/register').send(userData);
    const recoverUser = await userRepository.findOne({ where: { email: userData.email } });
  
    if (recoverUser) {
      const response = await request(app)
        .post('/api/v1/user/recover')
        .send({ email: recoverUser.email });
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('Password reset token generated successfully');
    } else {
      throw new Error('User not found');
    }
  });
  
  it('should return a 404 error if the user email is not found', async () => {
    const nonExistingEmail = 'nonexisting@example.com';
  
    // Send a request to the recover endpoint with a non-existing email
    const response = await request(app)
      .post('/api/v1/user/recover')
      .send({ email: nonExistingEmail });
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('User not found');
  });


  it('should return 200 and update the password if the recovery token is valid and the user exists', async () => {
    const recoverToken = jwt.sign({ email: userData.email }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1h' });
    const response = await request(app)
      .put(`/api/v1/user/recover/confirm?recoverToken=${recoverToken}`)
      .send({ password: 'newPassword123' });
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Password updated successfully');


  });
  
  it('should return 404 if the recovery token is invalid or missing', async () => {
    const response = await request(app)
      .put('/api/v1/user/recover/confirm')
      .send({ password: 'newPassword123' });
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Invalid or expired token');
  });

  it('should return 404 if the user associated with the token does not exist', async () => {
    const invalidToken = jwt.sign({ email: 'nonexistent@gmail.com' }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: '1h' });
    const response = await request(app)
      .put(`/api/v1/user/recover/confirm?recoverToken=${invalidToken}`)
      .send({ password: 'newPassword123' });
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('User not found');
  });
  
});

describe('Get All Users Tests', () => {
  it('should return 200 and a success message with users', async () => {
    const response = await request(app).get('/api/v1/user/getAllUsers');

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Users fetched successfully');
  });
  

  it('should delete all users and return a success message with count', async () => {
    const response = await request(app).delete('/api/v1/user/deleteUsers');

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('All users deleted successfully');
  });
});
describe('update user Profile', () => {
  interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    userType?: Role; 
    googleId?: string;
    facebookId?: string;
    picture?: string;
    provider?: string;
    isVerified: boolean;
    twoFactorCode?: number; 
  }

  interface Role {
    id: number;
    name: string;
    permissions: string[];
  }


let user: IUser | undefined | null;
const userData = {
firstName: 'jan',
lastName: 'bosco',
email: 'bosco@gmail.com',
password: 'boscoPassword123',
};

beforeEach(async () => {

await request(app).post('/api/v1/register').send(userData);
user = await userRepository.findOne({ where: { email: userData.email } });
});

it('should update the user profile successfully', async () => {
if (user) {
  const newUserData = {
    firstName: 'NewFirstName',
    lastName: 'NewLastName',
    email: 'newemail@example.com',
    password: 'bosco@gmail.com',
  };

  const response = await request(app)
    .put(`/api/v1/updateProfile/${user?.id}`)
    .send(newUserData);
  expect(response.statusCode).toBe(201);
  expect(response.body.message).toBe('User updated successfully');
}
});

it('should return 404 when user not found', async () => {
const Id = 999;  
const response = await request(app)
  .put(`/api/v1/updateProfile/${Id}`)
  .send(userData);
expect(response.statusCode).toBe(404);
expect(response.body.error).toBe('User not found');
});

it('should return 400 when email already exists', async () => {
if (user) {
  const newUserData = {
    firstName: 'NewFirstName',
    lastName: 'NewLastName',
    email: 'newemail@example.com', 
    password: 'bosco@gmail.com',
  };

  const response = await request(app)
    .put(`/api/v1/updateProfile/${user.id}`)
    .send(newUserData);
  expect(response.statusCode).toBe(400); 
  expect(response.body.error).toBe('Email is already taken'); 
}
});
});
