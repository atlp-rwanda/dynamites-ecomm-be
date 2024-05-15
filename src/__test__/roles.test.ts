import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook } from './testSetup';
beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('RoleController test', () => {
  it('should create a new role successfully', async () => {
    const formData = {
      name: 'test-role',
      permissions: ['test-permission1', 'test-permission2'],
    };

    const response = await request(app)
      .post('/api/v1/roles/create_role')
      .send(formData);
    expect(response.status).toBe(201);
    expect(response.body.msg).toBe('Role created successfully');
  });

  it('should return a 409 if role to create already exists', async () => {
    const formData = {
      name: 'test-role',
      permissions: ['test-permission1', 'test-permission2'],
    };

    const response = await request(app)
      .post('/api/v1/roles/create_role')
      .send(formData);
    expect(response.status).toBe(409);
    expect(response.body.msg).toBe('Role already exists');
  });

  it('should return a 400 if validation on createRole fails', async () => {
    const formData = {
      name: '',
      permissions: ['test-permission1', 'test-permission2'],
    };

    const response = await request(app)
      .post('/api/v1/roles/create_role')
      .send(formData);
    expect(response.status).toBe(400);
  });

  it('should return a 400 if validation on updateRole fails', async () => {
    const formData = {
      name: '',
      permissions: ['test-permission1', 'test-permission2'],
    };

    const response = await request(app)
      .put('/api/v1/roles/update_role')
      .send(formData);
    expect(response.status).toBe(400);
  });

  it('should update an existing role successfully', async () => {
    const formData = {
      name: 'test-role1',
      permissions: ['test-permission1', 'test-permission2', 'test-permission3'],
    };

    const createResponse = await request(app)
      .post('/api/v1/roles/create_role')
      .send(formData);

    const roleToUpdate = {
      id: createResponse.body.role.id,
      name: 'test-role5',
      permissions: ['test-permission1'],
    };

    const response = await request(app)
      .put('/api/v1/roles/update_role')
      .send(roleToUpdate);
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Role successfully updated');
  });

  it('should return a 404 if role to update does not exist', async () => {
    const roleToUpdate = {
      id: 10,
      name: 'test-role',
      permissions: ['test-permission1'],
    };

    const response = await request(app)
      .put('/api/v1/roles/update_role')
      .send(roleToUpdate);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Role not found');
  });

  it('should get all roles successfully', async () => {
    const response = await request(app).get('/api/v1/roles/get_roles');
    expect(response.status).toBe(200);
  });

  it('should delete role successfully', async () => {
    const formData = {
      name: 'test-role3',
      permissions: ['test-permission1', 'test-permission2'],
    };

    const createResponse = await request(app)
      .post('/api/v1/roles/create_role')
      .send(formData);

    const response = await request(app).delete(
      `/api/v1/roles/delete_role/${createResponse.body.role.id}`
    );
    expect(response.status).toBe(204);
  });

  it('should return a 404 upon delete if id provided is non-existent', async () => {
    const response = await request(app).delete(
      '/api/v1/roles/delete_role/99999999'
    );
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('Role not found');
  });

  it('should change user role successfully', async () => {
    const createRoleformData = {
      name: 'Buyer',
      permissions: ['test-permission1', 'test-permission2', 'test-permission3'],
    };

    await request(app)
      .post('/api/v1/roles/create_role')
      .send(createRoleformData);

    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testing123@gmail.com',
      password: 'TestPassword123',
      userType: 'buyer',
    };
    const createResponse = await request(app)
      .post('/api/v1/register')
      .send(userData);

    console.log(createResponse.body)  

    const formData = {
      userId: createResponse.body.user.id,
      newRoleId: createResponse.body.user.userType.id,
    };

    const response = await request(app)
      .patch('/api/v1/roles/change_user_role')
      .send(formData);
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('User role successfully updated');
  });

  it('should return a 404 if user is not found on change user role operation', async () => {
    const formData = {
      userId: 100,
      newRoleId: 2,
    };

    const response = await request(app)
      .patch('/api/v1/roles/change_user_role')
      .send(formData);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe('User not found');
  });

  it('should return a 400 if validation fails on change user role', async () => {
    const formData = {
      userId: 100,
      newRoleId: 'some id',
    };

    const response = await request(app)
      .patch('/api/v1/roles/change_user_role')
      .send(formData);
    expect(response.status).toBe(400);
  });
});
