import { NextFunction, Request, RequestHandler, Response } from 'express';
import { IUserWithoutPassword } from '../database/interfaces/IUser';
import Auth from '../utils/Auth';

export interface AuthRequest extends Request {
  user?: IUserWithoutPassword
}

const authMiddleware: RequestHandler = (req:AuthRequest, res:Response, next:NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ message: 'Token not found' });

    const response = Auth.validateToken(authorization) as IUserWithoutPassword;

    const { id, username, role, email } = response;
    if (response) {
      req.user = {
        id: Number(id),
        username,
        role,
        email,
      };
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default authMiddleware;
