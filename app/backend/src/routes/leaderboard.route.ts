import { Router } from 'express';
import LeaderboardHomeController from '../controllers/LeaderboardHomeController';

const leaderBorderRoute = Router();

leaderBorderRoute.get('/home', (req, res, next) =>
  LeaderboardHomeController.getLeaderBoard(req, res, next));

export default leaderBorderRoute;
