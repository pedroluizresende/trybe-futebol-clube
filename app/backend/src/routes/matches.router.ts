import { Router } from 'express';
import MatchController from '../controllers/MatchController';

const matchesRouter = Router();

matchesRouter.get('/', (req, res) => MatchController.getAll(req, res));

export default matchesRouter;
