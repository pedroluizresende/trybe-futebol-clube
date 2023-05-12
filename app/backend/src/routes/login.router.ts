import { Router } from 'express';
import validateLoginFields from '../middlewares/validateLoginFields.middleware';
import LoginController from '../controllers/LoginController';

const loginRouter = Router();

loginRouter.post('/', validateLoginFields, (req, res, next) =>
  LoginController.login(req, res, next));

export default loginRouter;
