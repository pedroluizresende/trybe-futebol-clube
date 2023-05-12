import { Request, Response, Router } from 'express';

const loginRouter = Router();

loginRouter.get('/', (_req: Request, res: Response): void => {
  res.status(200).json('teste login');
});

export default loginRouter;
