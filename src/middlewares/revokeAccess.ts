import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface DecodedJwtPayload {
  user?: {
    id: number;
    status: string;
  };
}
const activeTokens: Record<number, string[]> = {};

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
    userEmail?: string;
    userType: {
      id: number;
      name: string;
      permissions: [];
    };
    user?: {
      id: number;
      status: string;
    };
  }
}

export const revokeAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret
    ) as DecodedJwtPayload;

    if (!decoded || !decoded.user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const user = decoded.user;
    req.user = user;
    if (user.status !== 'active') {
      const userId = user.id;
      if (activeTokens[userId]) {
        delete activeTokens[userId];
      }

      return res
        .status(401)
        .json({ message: 'Unauthorized: User account is deactivated' });
    }

    const userId = user.id;
    if (!activeTokens[userId]) {
      activeTokens[userId] = [];
    }
    activeTokens[userId].push(token);

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
