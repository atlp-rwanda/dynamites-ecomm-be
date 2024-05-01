import { Request, Response, NextFunction } from 'express';
import dbConnection from '../database';
import { Role } from '../database/models/roleEntity';

const roleRepository = dbConnection.getRepository(Role);

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // @ts-expect-error Expect error because user does not exist on Request type
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  };
};

export const checkPermissions = async (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = await roleRepository.findOneBy({
      // @ts-expect-error Expect error because user does not exist on Request type
      name: req.user.role,
    });

    if (userRole && userRole.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  };
};
