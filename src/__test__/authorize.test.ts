import { Request, Response, NextFunction } from 'express';
import { checkRole, checkPermissions } from '../middlewares/authorize';
import dbConnection from '../database';
import { Role } from '../database/models/roleEntity';

jest.mock('../database');

describe('authorize middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;
  let roleRepositoryMock: { findOne: jest.Mock };

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    statusSpy = jest.spyOn(res, 'status');
    jsonSpy = jest.spyOn(res, 'json');
    roleRepositoryMock = { findOne: jest.fn() };
    (dbConnection.getRepository as jest.Mock).mockReturnValue(roleRepositoryMock);
  });

  describe('checkRole', () => {
    it('calls next if the user has the correct role', async () => {
      req.user = { userType: { name: 'admin' } };
      const middleware = checkRole(['admin']);

      await middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(statusSpy).not.toHaveBeenCalled();
      expect(jsonSpy).not.toHaveBeenCalled();
    });
  });

  describe('checkPermissions', () => {
    it('calls next if the user has the correct permission', async () => {
      req.user = { userType: { name: 'admin' } };
      roleRepositoryMock.findOne.mockResolvedValue({ permissions: ['read'] });
      const middleware = await checkPermissions('read');

      await middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(statusSpy).not.toHaveBeenCalled();
      expect(jsonSpy).not.toHaveBeenCalled();
    });
  });
});