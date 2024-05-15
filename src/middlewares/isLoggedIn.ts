import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: number;
  email: string;
  userType: {
    id: number;
    name: string;
    permissions: string[];
  };
}

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
    userEmail?: string;
    userType: {
      id: number;
      name: string;
      permissions: string[];  
    };
  }
}

export const IsLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as DecodedToken;

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userType = {
      id: decoded.userType.id,
      name: decoded.userType.name,
      permissions: decoded.userType.permissions,
    };

    // Check if user type is 'Admin', otherwise, deny access
    if (req.userType.name !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: User not authorized' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};