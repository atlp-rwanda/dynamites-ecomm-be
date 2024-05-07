import { Request, Response, NextFunction } from 'express';
import dbConnection from '../database';
import { Role } from '../database/models/roleEntity';

const roleRepository = dbConnection.getRepository(Role);

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user && roles.includes(req.user.userType.name)) {
      next();
    } else {
      res.status(403).json({msg:'Forbidden'});
    }
  };
};

export const checkPermissions = async (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = await roleRepository.findOneBy({
      name: req.user!.userType.name,
    });

    if (userRole && userRole.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({msg:'Forbidden'});
    }
  };
};
