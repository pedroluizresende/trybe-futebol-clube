import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import MatchController from '../controllers/MatchController';

const matchesRouter = Router();

matchesRouter.get('/', (req, res) => MatchController.getAll(req, res));

matchesRouter.patch(
  '/:id/finish',
  authMiddleware,
  (req, res, next) => MatchController.updateInProgres(req, res, next),
);

export default matchesRouter;
