import { Router } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderBorderRoute = Router();

leaderBorderRoute.get('/home', (req, res, next) =>
  LeaderboardController.getHomeLeaderBoard(req, res, next));

leaderBorderRoute.get('/away', (req, res, next) =>
  LeaderboardController.getAwayLeaderBoard(req, res, next));

export default leaderBorderRoute;
