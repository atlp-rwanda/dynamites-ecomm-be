import { Request, Response, NextFunction } from 'express';
import dbConnection from '../database';
import { Role } from '../database/models/roleEntity';

const roleRepository = dbConnection.getRepository(Role);

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Assuming req.user contains the user information after authentication
      if (
        req.user &&
        req.user.userType &&
        roles.includes(req.user.userType.name)
      ) {
        return next();
      } else {
        return res.status(403).json({ msg: 'Forbidden' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export const checkPermissions = async (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = await roleRepository.findOne({
        where: { name: req.user!.userType.name },
      });

      if (userRole && userRole.permissions.includes(permission)) {
        return next();
      } else {
        return res.status(403).json({ msg: 'Forbidden' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};