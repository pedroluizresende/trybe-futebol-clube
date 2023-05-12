import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import LoginService from '../services/LoginService';

class LoginController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const token = await LoginService.login(email, password);

      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  }

  static loginRole(req: AuthRequest, res: Response, next: NextFunction) {
    const { user } = req;
    try {
      if (user) {
        res.status(200).json({ role: user.role });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default LoginController;
