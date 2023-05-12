import { Router } from 'express';
import MatchController from '../controllers/MatchController';

const matchesRouter = Router();

matchesRouter.get('/', (req, res, next) => MatchController.getAll(req, res, next));

export default matchesRouter;
