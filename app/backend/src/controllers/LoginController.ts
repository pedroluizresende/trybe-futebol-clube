import { NextFunction, Request, Response } from 'express';
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
}

export default LoginController;
