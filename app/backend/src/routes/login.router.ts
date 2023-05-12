import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import validateLoginFields from '../middlewares/validateLoginFields.middleware';
import LoginController from '../controllers/LoginController';

const loginRouter = Router();

loginRouter.post('/', validateLoginFields, (req, res, next) =>
  LoginController.login(req, res, next));

loginRouter.get('/role', authMiddleware, (req, res) =>
  LoginController.loginRole(req, res));

export default loginRouter;
